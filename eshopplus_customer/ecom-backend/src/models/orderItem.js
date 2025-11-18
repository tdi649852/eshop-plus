const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { ORDER_STATUS } = require('../utils/constants');

class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id',
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
    retailerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'retailer_id',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
      defaultValue: ORDER_STATUS.PENDING,
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
  },
);

module.exports = OrderItem;


