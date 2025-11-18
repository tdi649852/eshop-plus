const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Product extends Model {}

Product.init(
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
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'category_id',
    },
    cityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'city_id',
    },
    name: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    sku: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    salePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    maxOrderQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'flat'),
      allowNull: true,
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  },
);

module.exports = Product;


