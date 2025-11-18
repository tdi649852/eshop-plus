const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Address extends Model {}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    cityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'city_id',
    },
    areaId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'area_id',
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    contactName: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    line1: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    line2: {
      type: DataTypes.STRING(180),
      allowNull: true,
    },
    landmark: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_default',
    },
  },
  {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
  },
);

module.exports = Address;


