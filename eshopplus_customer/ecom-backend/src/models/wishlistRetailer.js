const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class WishlistRetailer extends Model {}

WishlistRetailer.init(
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
    retailerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'retailer_id',
    },
  },
  {
    sequelize,
    modelName: 'WishlistRetailer',
    tableName: 'wishlist_retailers',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'retailer_id'],
        name: 'unique_wishlist_retailer',
      },
    ],
  },
);

module.exports = WishlistRetailer;
