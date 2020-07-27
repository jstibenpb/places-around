require('dotenv').config();

const config = {
  port: 5000,
  dbName: process.env.dbName,
  dbUser: process.env.dbUser,
  dbPass: process.env.dbPass,
  dbUrl: process.env.dbUrl,
  dbPort: process.env.dbPort,
  API_KEY_JWT_AT: process.env.API_KEY_JWT_AT,
  TOKEN_EXPIRES_AT: Number(process.env.TOKEN_EXPIRES_AT), // 15m
  API_KEY_JWT_RT: process.env.API_KEY_JWT_RT,
  TOKEN_EXPIRES_RT: Number(process.env.TOKEN_EXPIRES_RT), // '60 days'
  API_KEY: process.env.API_KEY,
  URL_PLACES_API: process.env.URL_PLACES_API,
  keysPlaces: process.env.keysPlaces.split(',') || [],
};

module.exports = config;
