/* eslint-disable no-undef */
const {
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
  waitResponse,
} = require('domain/legenda/service');

const config = require('config/properties');
const log = require('infra/log');

const { crawlers, processes } = require('data/models');
const status = require('data/enum/crawler');

let browser;
let page;
const getData = async (text, id = undefined) => {
  browser = await openBrowser();
  try {
    page = await browser.newPage();
    await disableIdle(page);

    await page.setRequestInterception(true);
    page.on('request', async (req) => {
      const type = await req.resourceType();
      if (type === 'image' || type === 'font' || type === 'stylesheet' ) {
        await req.abort();
      } else {
        await req.continue();
      }
    });

    await openPage(page, config.legendaTv.url);
    await closePopup(page, '#help-box-close', '#overlay');

    await click(page, '.js_entrar');
    await waitElementLoad(page, '.login_box', { visible: true });

    await typeInput(page, 'input[name="data[User][username]', config.legendaTv.user);
    await typeInput(page, 'input[name="data[User][password]', config.legendaTv.password);
    await submitForm(page, '.login_box');
    await closePopup(page, '#likebox-close', '#fanback');
    await typeInput(page, '#search-box', text);
    await click(page, 'input[class="icon_zoom"]');
    await waitElementLoad(page, 'h2', { visible: true });

    const loadMore = async (page) => {
      await page.waitForTimeout(800);
      const loaderButton = await page.$$('.load_more');
      return loaderButton.length;
    };

    while (await loadMore(page)) {
      const linkLoadMore = await page.$eval('a[class="load_more"]', element => element.href);
      await click(page, 'a[class="load_more"]', '.loading_modal');
      await waitResponse(page, linkLoadMore);
    }

    const urls = await getUrl(page, text);

    const completeResponse = await getRatioAndDownload(page, urls, id);
    await browser.close();

    return completeResponse;
  } catch (e) {
    await browser.close();
    log.error({label: 'CRAWLER', message: e.message});
    throw e;
  }
};

const start = async () => {
  try {
    const runningProcess = await processes.findOne({
      where: {
        status: status.PROCESSING
      }
    });

    if(runningProcess && !browser) {
      runningProcess.status = status.PENDING;
      await runningProcess.save();

      const crawlerUnfinished = await crawlers.findAll({
        where: {
          processId: runningProcess.id
        }
      });
      await crawlerUnfinished.destroy();
      start();
    }

    if(!runningProcess) {
      const pendingProcess = await processes.findOne({
        where: {
          status: status.PENDING
        }
      });

      if(pendingProcess) {
        const text = pendingProcess.keyWord;

        pendingProcess.status = status.PROCESSING;
        await pendingProcess.save();

        const response = await getData(text, pendingProcess.id);
        log.info({label: 'CRAWLER', message: `Foram encontradas ${response.length} legendas`});

        pendingProcess.status = status.DONE;
        await pendingProcess.save();
        start();
      }

    }
  } catch (e) {
    log.error({ label: 'CRAWLER', message: e.message });
  }
};

const kill = async () => {
  try {
    await browser.close();
    log.info({label: 'CRAWLER', message: 'Processo de Coleta foi parado' });
  } catch (e) {
    log.error({label: 'CRAWLER', message: e.message });
  }
};
module.exports = {
  getData,
  kill,
  start,
};
