const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class RetailerFollower extends Model {}

RetailerFollower.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'customer_id',
    },
    retailerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'retailer_id',
    },
  },
  {
    sequelize,
    modelName: 'RetailerFollower',
    tableName: 'retailer_followers',
    indexes: [
      {
        unique: true,
        fields: ['customer_id', 'retailer_id'],
        name: 'unique_follower',
      },
    ],
  },
);

module.exports = RetailerFollower;
