const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class CartItem extends Model {}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'cart_id',
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id',
    },
    productVariantId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'product_variant_id',
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    priceSnapshot: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
  },
);

module.exports = CartItem;


