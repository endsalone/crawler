const { andThen, compose } = require('ramda');
const log = require('infra/log');

const addRequestTime = (req, _, next) => {
  req.beginRequest = new Date().getTime();
  next();
};

const finishRequest = async (req) => {
  const timeRequest = new Date().getTime() - req.beginRequest;
  const message = {
    agent: req.headers['user-agent'],
    method: req.method,
    path: req.url,
    time: `${timeRequest} ms`,
  };
  log.info({label: 'REQUEST', message});
};

const aggregator = (fn) => async (req) => {
  await fn(req);
  return req;
};

const monitor = (fn) => (
  compose(
    andThen(finishRequest),
    aggregator(fn)
  )
);

module.exports = {
  addRequestTime,
  monitor
};
