/* eslint-disable no-console */
const { Sequelize } = require('sequelize');

const config = require('../config');

const sequelize = new Sequelize(
  `postgres://${config.dbUser}:${config.dbPass}@${config.dbUrl}:${config.dbPort}/${config.dbName}`
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
