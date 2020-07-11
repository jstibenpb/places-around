const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const config = require('../../../config');
const schemes = require('../models/postgreSQL');

module.exports.signUp = async (res, parameters) => {
  const {
    password,
    passwordConfirmation,
    email,
    username,
    name,
    lastName,
  } = parameters;

  if (password === passwordConfirmation) {
    const newUser = schemes.User.build({
      userid: uuidv4(),
      username,
      password: Bcrypt.hashSync(password, 10),
      email,
      name,
      lastname: lastName,
      jwttoken: 'prueba',
      createdon: 14892488294892,
      lastlogin: null,
    });

    try {
      await newUser.save(newUser);

      const token = jwt.sign(
        { email, id: newUser.userid, username },
        config.API_KEY_JWT,
        { expiresIn: config.TOKEN_EXPIRES_IN }
      );

      return res.status(201).json({ token });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error,
      });
    }
  }

  return res.status(400).json({
    status: 400,
    message: 'Passwords are different, try again!!!',
  });
};
