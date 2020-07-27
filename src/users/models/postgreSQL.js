const { DataTypes } = require('sequelize');

const sequelize = require('../../../services/postgreSQL');

const User = sequelize.define(
  'User',
  {
    user_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^[a-z0-9]*$/,
          msg: 'Username must only contain lowercase letters and numbers',
        },
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_on: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    last_login: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
    tableName: 'users', // optional, plural model name by default
  }
);

const Authorization = sequelize.define(
  'Authorization',
  {
    user_id: {
      type: DataTypes.UUID,
      unique: false,
      allowNull: false,
      primaryKey: true,
    },
    token_type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    iat: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    exp: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    valid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
    tableName: 'authorizations', // optional, plural model name by default
  }
);

const Blacklist = sequelize.define(
  'Blacklist',
  {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    exp: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
    tableName: 'blacklist', // optional, plural model name by default
  }
);

module.exports = {
  User,
  Authorization,
  Blacklist,
};
