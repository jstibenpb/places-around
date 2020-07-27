const express = require('express');

const controller = require('./controller/index');
const schemas = require('./utils/schemasValidation');
const { inputCheck } = require('../../middlewares/validateSchemas');
const {
  checkIfAuthenticated,
  checkBlacklist,
} = require('../../middlewares/validateAuth');

const router = express.Router();

router.post(
  '/api/v1/signup',
  inputCheck(schemas.signUp, 'body'),
  (req, res) => {
    controller.signUp(res, req.body, req.requestInfo);
  }
);

router.post('/api/v1/login', inputCheck(schemas.logIn, 'body'), (req, res) => {
  controller.logIn(res, req.body, req.requestInfo);
});

router.post(
  '/api/v1/logout',
  checkIfAuthenticated,
  checkBlacklist,
  inputCheck(schemas.logOut, 'body'),
  (req, res) => {
    controller.logOut(res, req.body, req.user);
  }
);

router.post(
  '/api/v1/token',
  inputCheck(schemas.newToken, 'body'),
  (req, res) => {
    controller.newToken(res, req.body);
  }
);

module.exports = router;
