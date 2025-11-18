const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class WishlistItem extends Model {}

WishlistItem.init(
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
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id',
    },
    cityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'city_id',
    },
  },
  {
    sequelize,
    modelName: 'WishlistItem',
    tableName: 'wishlist_items',
  },
);

module.exports = WishlistItem;


