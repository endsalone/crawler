const { app } = require('infra/http/server');
const log = require('infra/log');
const config = require('config/properties');
const database = require('db/connection');
const crawler = require('domain/legenda');

app.listen(config.port, async () => {
  try {
    await database.start();
    await crawler.start();
    log.debug({ label: 'SERVER', message: `RUNNING ON PORT ${config.port}`});
  } catch (e) {
    log.error({ label: 'SERVER', message: e.message});
    log.error({ label: 'SERVER', message: 'KILLING PROCESS'});

    process.exit();
  }
});

process.on('SIGINT', async () => {
  log.info({label: 'SERVER', message: 'CLOSE'});
  await database.stop();
  process.exit();
});

process.on('SIGTERM', async () => {
  app.close();
  await database.stop();
  log.error({server: 'KILLED' });
});
