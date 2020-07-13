const express = require('express');

const controller = require('./controller/index');
const middleware = require('../../middlewares/validateSchemas');
const schemas = require('./models/joi');

const router = express.Router();

router.post(
  '/api/v1/signup',
  middleware(schemas.signUp, 'body'),
  (req, res) => {
    controller.signUp(res, req.body);
  }
);

router.post('/api/v1/login', middleware(schemas.logIn, 'body'), (req, res) => {
  controller.logIn(res, req.body);
});

module.exports = router;
