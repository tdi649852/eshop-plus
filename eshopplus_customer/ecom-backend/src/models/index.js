const sequelize = require('../config/database');
const City = require('./city');
const Area = require('./area');
const User = require('./user');
const Address = require('./address');
const Retailer = require('./retailer');
const Category = require('./category');
const Product = require('./product');
const ProductVariant = require('./productVariant');
const ProductImage = require('./productImage');
const Cart = require('./cart');
const CartItem = require('./cartItem');
const WishlistItem = require('./wishlistItem');
const Order = require('./order');
const OrderItem = require('./orderItem');
const OrderStatusHistory = require('./orderStatusHistory');
const RefreshToken = require('./refreshToken');

// Associations
City.hasMany(Area, { foreignKey: 'cityId', as: 'areas' });
Area.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

City.hasMany(Retailer, { foreignKey: 'cityId', as: 'retailers' });
Retailer.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

Area.hasMany(Retailer, { foreignKey: 'areaId', as: 'areaRetailers' });
Retailer.belongsTo(Area, { foreignKey: 'areaId', as: 'area' });

User.belongsTo(City, { foreignKey: 'defaultCityId', as: 'defaultCity' });
City.hasMany(User, { foreignKey: 'defaultCityId', as: 'residents' });

User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Address.belongsTo(City, { foreignKey: 'cityId', as: 'city' });
Address.belongsTo(Area, { foreignKey: 'areaId', as: 'area' });

User.hasOne(Retailer, { foreignKey: 'userId', as: 'store' });
Retailer.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Retailer.hasMany(Product, { foreignKey: 'retailerId', as: 'products' });
Product.belongsTo(Retailer, { foreignKey: 'retailerId', as: 'retailer' });

City.hasMany(Product, { foreignKey: 'cityId', as: 'cityProducts' });
Product.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'productVariantId', as: 'variant' });

User.hasMany(WishlistItem, { foreignKey: 'userId', as: 'wishlistItems' });
WishlistItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WishlistItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'customer' });
Order.belongsTo(Address, { foreignKey: 'addressId', as: 'shippingAddress' });
Order.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'productVariantId', as: 'variant' });
OrderItem.belongsTo(Retailer, { foreignKey: 'retailerId', as: 'retailer' });

Order.hasMany(OrderStatusHistory, { foreignKey: 'orderId', as: 'statusHistory' });
OrderStatusHistory.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  City,
  Area,
  User,
  Address,
  Retailer,
  Category,
  Product,
  ProductVariant,
  ProductImage,
  Cart,
  CartItem,
  WishlistItem,
  Order,
  OrderItem,
  OrderStatusHistory,
  RefreshToken,
};


