const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Advertisement extends Model {}

Advertisement.init(
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
    type: {
      type: DataTypes.ENUM('category_top', 'discount_top', 'deal', 'home_banner'),
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'category_id',
    },
    cityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'city_id',
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'duration_days',
    },
    designImageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'design_image_url',
    },
    externalLink: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'external_link',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'amount_paid',
    },
    impressions: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    clicks: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'expired', 'cancelled'),
      defaultValue: 'pending',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_date',
    },
  },
  {
    sequelize,
    modelName: 'Advertisement',
    tableName: 'advertisements',
  },
);

module.exports = Advertisement;
