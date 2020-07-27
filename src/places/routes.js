const express = require('express');

const controller = require('./controller/index');
const { inputCheck } = require('../../middlewares/validateSchemas');
const schemas = require('./utils/schemasValidation');

const router = express.Router();

router.get(
  '/api/v1/find',
  inputCheck(schemas.findPlaces, 'query'),
  (req, res) => {
    controller.findPlaces(res, req.query, req.requestInfo, req.user);
  }
);

router.get('/api/v1/list', (req, res) => {
  controller.listTransactions(res, req.query, req.requestInfo, req.user);
});

module.exports = router;
