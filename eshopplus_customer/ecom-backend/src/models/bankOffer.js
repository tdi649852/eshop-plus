const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class BankOffer extends Model {}

BankOffer.init(
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
    bankName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: 'bank_name',
    },
    offerDetails: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'offer_details',
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'discount_percentage',
    },
    validityStart: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'validity_start',
    },
    validityEnd: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'validity_end',
    },
    termsConditions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'terms_conditions',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    modelName: 'BankOffer',
    tableName: 'bank_offers',
  },
);

module.exports = BankOffer;
