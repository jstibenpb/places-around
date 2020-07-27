const Joi = require('@hapi/joi');

const schemas = {
  findPlaces: Joi.object().keys({
    type: Joi.string().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    radius: Joi.number().required(),
  }),
};

module.exports = schemas;
