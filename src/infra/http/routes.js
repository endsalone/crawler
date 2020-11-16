const { route } = require('infra/http/bootstrap');
const { monitor } = require('application/midlleware/monitor');

const healthCheck = require('application/handlers/health/check');

const createProcess = require('application/handlers/process/create');
const getProcess = require('application/handlers/process/get');
const listProcess = require('application/handlers/process/list');
const deleteProcess = require('application/handlers/process/delete');

const getLegendas = require('application/handlers/legendas/get');

route.get('/api/healthcheck', monitor(healthCheck));

route.get('/api/process', monitor(listProcess));
route.get('/api/process/:id', monitor(getProcess));
route.post('/api/process', monitor(createProcess));
route.delete('/api/process/:id', monitor(deleteProcess));

route.get('/api/legendas/:id', monitor(getLegendas));

module.exports = route;
