/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const config = require('../config');
const schemes = require('../src/users/models/postgreSQL');

const checkIfAuthenticated = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token)
    return res.status(401).json({
      message: 'No token provided',
      error: 'access_token',
    });

  jwt.verify(token, config.API_KEY_JWT_AT, (err, decoded) => {
    if (err)
      return res
        .status(401)
        .json({ message: 'Invalid token', error: 'access_token' });
    req.user = decoded;
    next();
  });
};

const checkBlacklist = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token)
    return res.status(401).json({
      message: 'No token provided',
      error: 'access_token',
    });

  const tokenBlackist = await schemes.Blacklist.findOne({
    where: { token },
  });

  if (tokenBlackist) {
    return res.status(401).json({
      message: 'Invalid token',
      error: 'access_token',
    });
  }

  next();
};

module.exports = { checkIfAuthenticated, checkBlacklist };
