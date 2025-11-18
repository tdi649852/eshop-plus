const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { RETAILER_STATUS } = require('../utils/constants');

class Retailer extends Model {}

Retailer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    storeName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    gstNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bannerUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressLine1: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    addressLine2: {
      type: DataTypes.STRING(180),
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
    status: {
      type: DataTypes.ENUM(...Object.values(RETAILER_STATUS)),
      defaultValue: RETAILER_STATUS.PENDING,
    },
    verificationNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deliveryRadiusKm: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Retailer',
    tableName: 'retailers',
  },
);

module.exports = Retailer;


