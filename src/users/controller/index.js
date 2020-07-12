const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

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

module.exports.logIn = async (res, parameters) => {
  const { password, username } = parameters;
  try {
    const userRecord = await schemes.User.findOne({
      where: { username: username.toLowerCase() },
    });
    if (userRecord) {
      if (Bcrypt.compareSync(password, userRecord.password)) {
        const token = jwt.sign(
          { email: userRecord.email, id: userRecord.userid, username },
          config.API_KEY_JWT,
          { expiresIn: config.TOKEN_EXPIRES_IN }
        );
        await schemes.User.update(
          {
            jwttoken: 'prueba',
            lastlogin: Number(moment.tz('America/Bogota')),
          },
          {
            where: {
              userid: userRecord.userid,
            },
          }
        );
        return res.status(200).json({ token });
      }
    }

    return res.status(401).json({
      status: 401,
      message: 'Login incorrect',
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error,
    });
  }
};
