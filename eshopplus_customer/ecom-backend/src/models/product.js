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
    nameHi: {
      type: DataTypes.STRING(180),
      allowNull: true,
      field: 'name_hi',
    },
    nameAr: {
      type: DataTypes.STRING(180),
      allowNull: true,
      field: 'name_ar',
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
    articleNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'article_number',
    },
    brandId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'brand_id',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descriptionHi: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description_hi',
    },
    descriptionAr: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description_ar',
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mrp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
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
    status: {
      type: DataTypes.ENUM('draft', 'published', 'out_of_stock', 'discontinued'),
      defaultValue: 'draft',
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  },
);

module.exports = Product;


