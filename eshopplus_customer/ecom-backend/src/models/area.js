const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Area extends Model {}

Area.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    cityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'city_id',
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Area',
    tableName: 'areas',
  },
);

module.exports = Area;


