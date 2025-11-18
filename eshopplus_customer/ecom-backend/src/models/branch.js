const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Branch extends Model {}

Branch.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    retailerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'retailer_id',
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    addressLine1: {
      type: DataTypes.STRING(180),
      allowNull: false,
      field: 'address_line1',
    },
    addressLine2: {
      type: DataTypes.STRING(180),
      allowNull: true,
      field: 'address_line2',
    },
    cityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'city_id',
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
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_main',
    },
  },
  {
    sequelize,
    modelName: 'Branch',
    tableName: 'branches',
  },
);

module.exports = Branch;
