const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ProductVariant extends Model {}

ProductVariant.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id',
    },
    label: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(80),
      allowNull: true,
      unique: true,
    },
    price: {
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
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ProductVariant',
    tableName: 'product_variants',
  },
);

module.exports = ProductVariant;


