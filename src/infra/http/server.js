const express = require('express');
const { app } = require('infra/http/bootstrap');
const helmet = require('helmet');
const { addRequestTime } = require('application/midlleware/monitor');
const route = require('infra/http/routes');

app.use(helmet());
app.use(addRequestTime);
app.use(express.json({extended: true}));
app.use(route);

module.exports = {
  app
};
