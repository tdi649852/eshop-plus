const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ProductImage extends Model {}

ProductImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id',
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'product_images',
  },
);

module.exports = ProductImage;


