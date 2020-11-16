const { sequelize } = require('data/models');
const log = require('infra/log');

const health = async (req) => {
  try {
    await sequelize.authenticate();
    req.res.send({ app: true, database: true });
    log.info({label: 'HEALTHCHECK', message: 'TRUE'});
  } catch (e) {
    log.error({label: 'HEALTHCHECK', message: e.message});
  }
};

module.exports = health;
