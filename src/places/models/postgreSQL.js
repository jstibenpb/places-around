const { DataTypes } = require('sequelize');

const sequelize = require('../../../services/postgreSQL');

const Transaction = sequelize.define(
  'Transaction',
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    original_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    radius: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    type_place: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    response: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    time: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
    tableName: 'transactions', // optional, plural model name by default
  }
);

module.exports = {
  Transaction,
};
