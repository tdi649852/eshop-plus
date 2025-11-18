const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Banner extends Model {}

Banner.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'image_url',
    },
    linkUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'link_url',
    },
    linkType: {
      type: DataTypes.ENUM('product', 'category', 'retailer', 'external'),
      defaultValue: 'external',
      field: 'link_type',
    },
    linkId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'link_id',
    },
    cityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'city_id',
      comment: 'NULL means all cities',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
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
    modelName: 'Banner',
    tableName: 'banners',
  },
);

module.exports = Banner;
