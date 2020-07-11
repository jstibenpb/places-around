require('dotenv').config();

const config = {
  port: 5000,
  dbName: process.env.dbName,
  dbUser: process.env.dbUser,
  dbPass: process.env.dbPass,
  dbUrl: process.env.dbUrl,
  dbPort: process.env.dbPort,
  API_KEY_JWT: process.env.API_KEY_JWT,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
};

module.exports = config;
