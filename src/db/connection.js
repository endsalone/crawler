const { sequelize } = require('data/models');
const log = require('infra/log');

const start = async () => {
  try {
    await sequelize.authenticate();
    log.info({label: 'DATABASE', message: 'CONNECTED'});
  } catch (e) {
    log.error({label: 'DATABASE', message: e.message});
  }
};

const stop = async () => {
  try {
    await sequelize.close();
    log.info({label: 'DATABASE', message: 'STOPPED'});
  } catch (e) {
    log.error({label: 'DATABASE', message: e.message});
  }
};

module.exports = {
  start,
  stop,
};
