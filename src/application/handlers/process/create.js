const { processes } = require('data/models');
const log = require('infra/log');
const processCrawler = require('domain/legenda');
const status = require('data/enum/crawler');

const create = async (req) => {
  try {
    const keyWord = req.body.keyWord;
    if(!keyWord) {
      return req.res.status(422).send({error: 'Favor informar a Palavra Chave que deseja buscar'});
    }

    const data = {
      keyWord,
      status: status.PENDING,
    };

    const save = await processes.create(data);

    const validate = (save) => {
      if(!save) {
        return req.res.status(400).send({error: 'Não foi possível salvar o processo'});
      }

      return req.res.status(201).send(save);
    };

    validate(save);

    processCrawler.start();
  } catch (e) {
    log.error({label: 'CRAWLER', message: e.message});
  }
};

module.exports = create;
