const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class WithdrawalRequest extends Model {}

WithdrawalRequest.init(
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    bankName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: 'bank_name',
    },
    accountNumber: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'account_number',
    },
    ifscCode: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'ifsc_code',
    },
    accountHolderName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: 'account_holder_name',
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
      defaultValue: 'pending',
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'admin_notes',
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'transaction_id',
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'processed_at',
    },
  },
  {
    sequelize,
    modelName: 'WithdrawalRequest',
    tableName: 'withdrawal_requests',
  },
);

module.exports = WithdrawalRequest;
