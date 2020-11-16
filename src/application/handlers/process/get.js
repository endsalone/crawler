const { processes } = require('data/models');
const log = require('infra/log');

const get = async (req) => {
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

    const validate = (process) => {
      if(!process) {
        return req.res.status(404).send({ error: 'Processo não encontrado'});
      }
      return req.res.send(process);
    };

    validate(process);

  } catch (e) {
    log.error({label: 'PROCESS', message: e.message});
    req.res.status(400).send({ error: 'Não foi possível processar', stracktrace: e.message});
  }
};

module.exports = get;
