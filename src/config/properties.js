require('dotenv').config();

module.exports ={
  env: process.env.NODE_ENV || 'prod',
  legendaTv: {
    password: process.env.LEGENDA_PASS || '',
    url: process.env.LEGENDA_URL || 'http://legendas.tv',
    user: process.env.LEGENDA_USER || '',
  },
  port: process.env.PORT,
};
