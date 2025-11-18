const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class City extends Model {}

City.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    state: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(80),
      allowNull: false,
      defaultValue: 'India',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'City',
    tableName: 'cities',
  },
);

module.exports = City;


