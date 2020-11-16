/* eslint-disable no-undef */
const puppeteer = require('puppeteer');
const {
  compose,
  indexOf,
  head,
  tail,
  toLower,
  split,
} = require('ramda');
const { crawlers } = require('data/models');
const log = require('infra/log');

const openBrowser = async () => puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});

const openPage = async (page, text) => page.goto(text);

const disableIdle = async (page) => {
  await page.setDefaultNavigationTimeout(0);
  await page.setDefaultTimeout(0);
  await page.setViewport({ height: 768, width: 1366 });
};

const closePopup = async (page, closeBtn, waitDiv) => {
  await page.click(closeBtn);
  await page.waitForSelector(waitDiv, {hidden: true});
};

const typeInput = async (page, input, text) => page.type(input, text);

const submitForm = async (page, form) => {
  const loginForm = await page.$(form);
  await loginForm.evaluate(form => form.submit());
  await page.waitForNavigation();
};

const click = async (page, clickElement) => page.click(clickElement);

const waitElementLoad = async (page, element, css = { hidden: true }) => (
  page.waitForSelector(element, css)
);

const waitPageLoad = async (page) => page.waitForNavigation({ waitUntil: 'networkidle0' });

const waitResponse = async (page, url) => page.waitForResponse(url);

const getUrl = async (page, text) => {
  const regexGenerator = (textArray) => {
    const arrayToFilter = [ 'os', 'as', 'e', 'a', 'e', 'the', 'what', 'who' ];
    const first = head(textArray);
    const format = (text) => new RegExp(`^.*${text}.*$`, 'g');

    if(indexOf(first, arrayToFilter) >= 0) {
      return format(tail(textArray).join('.'));
    }
    return format(textArray.join('.'));
  };

  const dataExtract = await page.evaluate(() => {
    const object = [];
    const links = [];
    const grades = [];
    const names = [];
    const downloads = [];
    const users = [];
    const dates = [];
    const languages= [];


    const downloadElements = document.querySelectorAll('a[href^="/download/"]');
    downloadElements.forEach((a) => {
      const link = a.href.toLowerCase();
      const name = a.innerText;
      links.push(link);
      names.push(name);
    });

    const dataElements = document.querySelectorAll('p[class="data"]');
    dataElements.forEach((p) => {
      const pInnerText = p.innerText;

      const grade = pInnerText
        .split(', ')[1]
        .split(' ')[1];

      const download = parseInt(
        pInnerText
          .split(', ')[1]
          .split(' ')[1]
      );

      const user = pInnerText
        .split(', ')[2]
        .split(' ')[2];

      const date = pInnerText
        .split(', ')[2]
        .split(' ')[4]
        .split('/')
        .reverse()
        .join('-');

      grades.push(grade);
      downloads.push(download);
      users.push(user);
      dates.push(date);
    });

    const languageElements = document.querySelectorAll('img[src*="idioma/"]');
    languageElements.forEach(img => {
      languages.push(img.title);
    });

    for(let i = 0; i < links.length; i++) {
      object.push({
        data: dates[i],
        downloads: downloads[i],
        idioma: languages[i],
        link: links[i],
        nome: names[i],
        nota: parseInt(grades[i]) || 0,
        usuario: users[i],
      });
    }

    return object;
  });

  const regex = compose(
    regexGenerator,
    split(' '),
    toLower
  )(text);

  return dataExtract.filter(value => value.link.match(regex));
};

const getRatioAndDownload = async (page, data, processId) => {
  for(let i = 0; i < data.length; i++) {
    await openPage(page, data[i].link);
    const { link, ratio } = await page.evaluate(() => {
      const votesElements = document.querySelector('div[class="middle download"]')
        .querySelectorAll('aside')[2]
        .querySelectorAll('p');
      const like = parseInt(votesElements[0].innerText);
      const dislike = parseInt(votesElements[0].innerText);

      const btn = document.querySelector('button[class="icon_arrow"]')
        .getAttribute('onclick').split('\'')[1];
      const link = window.location.origin + btn;

      return {
        link,
        ratio: like / dislike || 0,
      };
    });
    data[i].link = link;
    data[i].ratio = ratio;
    data[i].processId = processId;

    if(processId) {
      await crawlers.create(data[i]);
      log.info({label: 'CRAWLER', message: data[i]});
    }
  }
  return data;
};

module.exports = {
  click,
  closePopup,
  disableIdle,
  getRatioAndDownload,
  getUrl,
  openBrowser,
  openPage,
  submitForm,
  typeInput,
  waitElementLoad,
  waitPageLoad,
  waitResponse,
};
