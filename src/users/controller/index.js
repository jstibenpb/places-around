const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

const config = require('../../../config');
const schemes = require('../models/postgreSQL');

const invalidateTokens = async (accessToken, exp, refreshToken) => {
  try {
    const tokenBlackList = schemes.Blacklist.build({
      token: accessToken,
      exp,
    });

    await tokenBlackList.save(tokenBlackList);
    // Missing: verify if values changed
    await schemes.Authorization.update(
      {
        valid: false,
      },
      {
        where: {
          token: refreshToken,
          token_type: 'refreshToken',
        },
      }
    );
    return { status: 'ok' };
  } catch (error) {
    return error;
  }
};

const createNewTokens = async (user) => {
  const accessToken = jwt.sign(
    { email: user.email, id: user.user_id, username: user.username },
    config.API_KEY_JWT_AT,
    { expiresIn: config.TOKEN_EXPIRES_AT / 1000 }
  );
  const refreshToken = jwt.sign({ id: user.user_id }, config.API_KEY_JWT_RT, {
    expiresIn: config.TOKEN_EXPIRES_RT / 1000,
  });
  return { accessToken, refreshToken };
};

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
    const date = Number(moment.tz('America/Bogota'));
    const newUser = schemes.User.build({
      user_id: uuidv4(),
      username,
      password: Bcrypt.hashSync(password, 10),
      email,
      name,
      lastname: lastName,
      created_on: date,
      last_login: date,
    });

    try {
      await newUser.save(newUser);

      const accessToken = jwt.sign(
        { email, id: newUser.user_id, username },
        config.API_KEY_JWT_AT,
        { expiresIn: config.TOKEN_EXPIRES_AT / 1000 }
      );

      const refreshToken = jwt.sign(
        { id: newUser.user_id },
        config.API_KEY_JWT_RT,
        { expiresIn: config.TOKEN_EXPIRES_RT / 1000 }
      );

      await schemes.Authorization.bulkCreate(
        [
          {
            user_id: newUser.user_id,
            token_type: 'accessToken',
            token: accessToken,
            iat: date,
            exp: date + config.TOKEN_EXPIRES_AT,
            valid: true,
          },
          {
            user_id: newUser.user_id,
            token_type: 'refreshToken',
            token: refreshToken,
            iat: date,
            exp: date + config.TOKEN_EXPIRES_RT,
            valid: true,
          },
        ],
        { validate: true }
      );

      return res.status(201).json({
        data: { accessToken, refreshToken },
        message: 'User created successfully',
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Sorry, user cannot be created, try again!!!',
      });
    }
  }

  return res.status(400).json({
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
        const date = Number(moment.tz('America/Bogota'));
        const accessToken = jwt.sign(
          { email: userRecord.email, id: userRecord.user_id, username },
          config.API_KEY_JWT_AT,
          { expiresIn: config.TOKEN_EXPIRES_AT / 1000 }
        );
        const refreshToken = jwt.sign(
          { id: userRecord.user_id },
          config.API_KEY_JWT_RT,
          { expiresIn: config.TOKEN_EXPIRES_RT / 1000 }
        );

        await schemes.User.update(
          {
            last_login: Number(moment.tz('America/Bogota')),
          },
          {
            where: {
              user_id: userRecord.user_id,
            },
          }
        );

        await schemes.Authorization.bulkCreate(
          [
            {
              user_id: userRecord.user_id,
              token_type: 'accessToken',
              token: accessToken,
              iat: date,
              exp: date + config.TOKEN_EXPIRES_AT,
              valid: true,
            },
            {
              user_id: userRecord.user_id,
              token_type: 'refreshToken',
              token: refreshToken,
              iat: date,
              exp: date + config.TOKEN_EXPIRES_RT,
              valid: true,
            },
          ],
          { validate: true }
        );

        return res.status(200).json({
          data: { accessToken, refreshToken },
          message: 'User successfully logged in',
        });
      }
    }

    return res.status(401).json({
      message: 'Incorrect login',
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Login cannot be completed',
    });
  }
};

module.exports.logOut = async (res, parameters, userInfo) => {
  const { username } = parameters;
  try {
    const userRecord = await schemes.User.findOne({
      where: { username: username.toLowerCase() },
    });
    if (userRecord) {
      const tokenBlackList = schemes.Blacklist.build({
        token: parameters.accessToken,
        exp: userInfo.exp * 1000,
      });

      await tokenBlackList.save(tokenBlackList);
      // Missing: verify if values changed
      await schemes.Authorization.update(
        {
          valid: false,
        },
        {
          where: {
            token: parameters.refreshToken,
            token_type: 'refreshToken',
          },
        }
      );
      return res.status(200).json({
        data: { username },
        message: 'User successfully logged out',
      });
    }

    return res.status(400).json({
      message: 'User not found',
      error: 'no_user',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: 'internal',
    });
  }
};

// eslint-disable-next-line consistent-return
module.exports.newToken = async (res, parameters) => {
  // eslint-disable-next-line camelcase
  const { user_id, accessToken, refreshToken } = parameters;
  try {
    const tokenRecord = await schemes.Authorization.findOne({
      where: {
        user_id,
        token: refreshToken,
        token_type: 'refreshToken',
        valid: true,
      },
    });

    const userRecord = await schemes.User.findOne({
      where: {
        user_id,
      },
    });

    if (!tokenRecord) {
      return res.status(401).json({
        message: 'Refresh token is invalid',
        error: 'invalid_refresh_token',
      });
    }

    if (!userRecord) {
      return res.status(400).json({
        message: 'User not found',
        error: 'no_user',
      });
    }

    jwt.verify(refreshToken, config.API_KEY_JWT_RT, async (err) => {
      if (err)
        return res.status(401).json({
          message: 'Refresh token is invalid',
          error: 'invalid_refresh_token',
        });

      await invalidateTokens(
        accessToken,
        Number(tokenRecord.exp),
        refreshToken
      );

      const newTokens = await createNewTokens(userRecord);

      return res.status(200).json({
        data: { newTokens },
        message: 'New tokens generated',
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: 'internal',
    });
  }
};
