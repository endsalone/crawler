const { crawlers, processes } = require('data/models');
const log = require('infra/log');
const processCrawler = require('domain/legenda');
const status = require('data/enum/crawler');

const deleteProcess = async (req) => {
  try {
    const query = req.params.id;
    if(!query) {
      req.res.status(403).send({ error: 'Favor informar o ID'});
    }

    const process = await processes.findOne({
      where: {
        id: query
      }
    });

    const validate = async (process) => {
      if(!process) {
        return req.res.status(400).send({error: 'Não foi possível encontrar o processo'});
      }

      await processCrawler.kill();

      await crawlers.destroy({
        where: {
          processId: process.id,
        }
      });

      process.status = status.CANCELLED;
      await process.save();
      return req.res.send(process);
    };

    await validate(process);

  } catch (e) {
    log.error({label: 'PROCESS', message: e.message});
  }
};

module.exports = deleteProcess;
