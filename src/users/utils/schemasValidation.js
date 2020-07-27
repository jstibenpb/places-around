const Joi = require('@hapi/joi');

const schemas = {
  signUp: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    passwordConfirmation: Joi.string().required(),
    name: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
  logIn: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  logOut: Joi.object().keys({
    username: Joi.string().required(),
    accessToken: Joi.string().required(),
    refreshToken: Joi.string().required(),
  }),
  newToken: Joi.object().keys({
    user_id: Joi.string().required(),
    accessToken: Joi.string().required(),
    refreshToken: Joi.string().required(),
  }),
};

module.exports = schemas;
