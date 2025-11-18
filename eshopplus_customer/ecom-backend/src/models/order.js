const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../utils/constants');

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    orderNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      field: 'order_number',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    retailerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'retailer_id',
    },
    addressId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'address_id',
    },
    cityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'city_id',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
      defaultValue: ORDER_STATUS.PENDING,
    },
    paymentStatus: {
      type: DataTypes.ENUM(...Object.values(PAYMENT_STATUS)),
      defaultValue: PAYMENT_STATUS.PENDING,
      field: 'payment_status',
    },
    paymentMethod: {
      type: DataTypes.ENUM('cod', 'prepaid', 'wallet'),
      defaultValue: 'cod',
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    deliveryFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      field: 'delivery_fee',
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    commissionPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 5.00,
      field: 'commission_percentage',
    },
    commissionAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'commission_amount',
    },
    returnRequested: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'return_requested',
    },
    returnReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'return_reason',
    },
    returnStatus: {
      type: DataTypes.ENUM('none', 'requested', 'approved', 'rejected', 'completed'),
      defaultValue: 'none',
      field: 'return_status',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  },
);

module.exports = Order;


