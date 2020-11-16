const { createLogger, format, transports } = require('winston');
const config = require('config/properties');

const logger = ({level, label}) => {
  return createLogger({
    format: format.combine(
      format.colorize(),
      format.label({ label }),
      format.timestamp(),
      format.printf(({label, level, message, timestamp}) =>
        `{level: "${level}", label: "${label}", message: ${JSON.stringify(message)}, timestamp: "${timestamp}" }`
      ),
    ),
    level,
    transports: [
      new transports.Console()
    ],
  });
};

const makeLog = ({label, level, message}) => {
  logger({label}).log(level, message, label);
};

const info = ({label, message}) => {
  makeLog({label, level: 'info', message});
};

const error = ({label, message}) => {
  makeLog({label, level: 'error', message});
};

const debug = ({label, message}) => {
  if(config.env !== 'prod'){
    makeLog({label, level: 'info', message});
  }
};

const warning = ({label, message}) => {
  makeLog({label, level: 'warn', message});
};

module.exports = {
  debug,
  error,
  info,
  warning,
};
