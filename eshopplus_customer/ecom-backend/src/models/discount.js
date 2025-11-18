const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Discount extends Model {}

Discount.init(
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
    type: {
      type: DataTypes.ENUM('store_wide', 'category', 'product'),
      allowNull: false,
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed_price'),
      defaultValue: 'percentage',
      field: 'discount_type',
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    applicableTo: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'applicable_to',
      comment: 'Array of category_ids or product_ids',
    },
    validityStart: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'validity_start',
    },
    validityEnd: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'validity_end',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    modelName: 'Discount',
    tableName: 'discounts',
  },
);

module.exports = Discount;
