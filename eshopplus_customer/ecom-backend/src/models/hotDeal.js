const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class HotDeal extends Model {}

HotDeal.init(
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
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url',
    },
    externalLink: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'external_link',
    },
    validityStart: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'validity_start',
    },
    validityEnd: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'validity_end',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    modelName: 'HotDeal',
    tableName: 'hot_deals',
  },
);

module.exports = HotDeal;
