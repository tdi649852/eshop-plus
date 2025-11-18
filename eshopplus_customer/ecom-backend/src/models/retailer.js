const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { RETAILER_STATUS } = require('../utils/constants');

class Retailer extends Model {}

Retailer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    uniqueId: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: true,
      field: 'unique_id',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    cityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'city_id',
    },
    areaId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'area_id',
    },
    storeName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    businessType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'business_type',
    },
    brandName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'brand_name',
    },
    slug: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    gstNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    panNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'pan_number',
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brandLogoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'brand_logo_url',
    },
    bannerUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressLine1: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    addressLine2: {
      type: DataTypes.STRING(180),
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(RETAILER_STATUS)),
      defaultValue: RETAILER_STATUS.PENDING,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_featured',
    },
    followersCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      field: 'followers_count',
    },
    kycStatus: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending',
      field: 'kyc_status',
    },
    kycDocumentUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'kyc_document_url',
    },
    subscriptionTier: {
      type: DataTypes.ENUM('free', 'basic', 'premium'),
      defaultValue: 'free',
      field: 'subscription_tier',
    },
    verificationNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deliveryRadiusKm: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    discountEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'discount_enabled',
    },
    storeDiscountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      field: 'store_discount_percentage',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Retailer',
    tableName: 'retailers',
  },
);

module.exports = Retailer;


