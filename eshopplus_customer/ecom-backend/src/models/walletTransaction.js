const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class WalletTransaction extends Model {}

WalletTransaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    type: {
      type: DataTypes.ENUM('credit', 'debit'),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('commission', 'refund', 'order_payment', 'withdrawal', 'add_money', 'subscription', 'advertisement'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    balanceAfter: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'balance_after',
    },
    referenceId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'reference_id',
      comment: 'Order ID, withdrawal ID, etc.',
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
      defaultValue: 'pending',
    },
    paymentGatewayResponse: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'payment_gateway_response',
    },
  },
  {
    sequelize,
    modelName: 'WalletTransaction',
    tableName: 'wallet_transactions',
  },
);

module.exports = WalletTransaction;
