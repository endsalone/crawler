const { processes, sequelize } = require('data/models');
const log = require('infra/log');
const list = async (req) => {
  try {
    const query = req.param('status') ? { status: req.param('status') } : {};
    const allProcesses = await processes.findAll({
      where: query
    });
    const grouped = await  processes.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'total']
      ],
      group: 'status',
      where: query,
    });

    const process = {
      data: allProcesses,
      meta: grouped
    };

    req.res.send(process);
  } catch (e) {
    log.error({label: 'PROCESS', message: e.message});
    req.res.status(400).send({ error: 'Não foi possível processar', stracktrace: e.message});
  }
};

module.exports = list;
