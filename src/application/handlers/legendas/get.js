const { crawlers } = require('data/models');
const log = require('infra/log');

const get = async (req) => {
  try {
    const query = req.params.id;

    if(!query) {
      req.res.status(403).send({ error: 'Favor informar o ID'});
    }

    const process = await crawlers.findAll({
      where: {
        processId: query
      }
    });

    const validate = (process) => {
      if(!process) {
        return req.res.status(404).send({ error: 'Processo não encontrado'});
      }

      const response = {
        data: process,
        meta: {
          total: process.length
        }
      };
      return req.res.send(response);
    };

    validate(process);

  } catch (e) {
    log.error({label: 'LEGENDAS', message: e.message});
    req.res.status(400).send({ error: 'Não foi possível processar', stracktrace: e.message});
  }
};

module.exports = get;
