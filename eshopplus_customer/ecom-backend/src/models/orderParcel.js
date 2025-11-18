const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class OrderParcel extends Model {}

OrderParcel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id',
    },
    title: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    trackingNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'tracking_number',
    },
    courierName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'courier_name',
    },
    status: {
      type: DataTypes.ENUM('preparing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'),
      defaultValue: 'preparing',
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'shipped_at',
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'delivered_at',
    },
  },
  {
    sequelize,
    modelName: 'OrderParcel',
    tableName: 'order_parcels',
  },
);

module.exports = OrderParcel;
