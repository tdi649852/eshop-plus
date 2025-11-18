const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { ORDER_STATUS } = require('../utils/constants');

class OrderStatusHistory extends Model {}

OrderStatusHistory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id',
    },
    changedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'changed_by',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING(180),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'OrderStatusHistory',
    tableName: 'order_status_history',
  },
);

module.exports = OrderStatusHistory;


