const status = require('../src/health/routes');
const users = require('../src/users/routes');
const places = require('../src/places/routes');
const {
  checkIfAuthenticated,
  checkBlacklist,
} = require('../middlewares/validateAuth');
const { getGeoip } = require('../middlewares/getData');

module.exports = (app) => {
  app.use('/status', status);
  app.use('/users', getGeoip, users);
  app.use('/places', getGeoip, checkBlacklist, checkIfAuthenticated, places);
  app.use('*', (req, res) => {
    res.send('Not found!!!');
  });
};
