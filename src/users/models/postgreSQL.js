const { DataTypes } = require('sequelize');

const sequelize = require('../../../services/postgreSQL');

const User = sequelize.define(
  'User',
  {
    userid: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jwttoken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdon: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    lastlogin: {
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

module.exports = {
  User,
};
