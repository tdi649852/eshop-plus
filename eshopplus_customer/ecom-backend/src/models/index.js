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

// New Advtez models
const Branch = require('./branch');
const Brand = require('./brand');
const Discount = require('./discount');
const HotDeal = require('./hotDeal');
const BankOffer = require('./bankOffer');
const WalletTransaction = require('./walletTransaction');
const WithdrawalRequest = require('./withdrawalRequest');
const Advertisement = require('./advertisement');
const Banner = require('./banner');
const RetailerFollower = require('./retailerFollower');
const WishlistRetailer = require('./wishlistRetailer');
const OrderParcel = require('./orderParcel');
const Notification = require('./notification');
const SupportTicket = require('./supportTicket');
const SupportTicketMessage = require('./supportTicketMessage');

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

// New Advtez associations
Retailer.hasMany(Branch, { foreignKey: 'retailerId', as: 'branches' });
Branch.belongsTo(Retailer, { foreignKey: 'retailerId', as: 'retailer' });
Branch.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

Brand.belongsTo(Retailer, { foreignKey: 'retailerId', as: 'retailer' });
Retailer.hasMany(Brand, { foreignKey: 'retailerId', as: 'brands' });

Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });
Brand.hasMany(Product, { foreignKey: 'brandId', as: 'products' });

Retailer.hasMany(Discount, { foreignKey: 'retailerId', as: 'discounts' });
Discount.belongsTo(Retailer, { foreignKey: 'retailerId', as: 'retailer' });

Retailer.hasMany(HotDeal, { foreignKey: 'retailerId', as: 'hotDeals' });
HotDeal.belongsTo(Retailer, { foreignKey: 'retailerId', as: 'retailer' });

Retailer.hasMany(BankOffer, { foreignKey: 'retailerId', as: 'bankOffers' });
BankOffer.belongsTo(Retailer, { foreignKey: 'retailerId', as: 'retailer' });

User.hasMany(WalletTransaction, { foreignKey: 'userId', as: 'walletTransactions' });
WalletTransaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(WithdrawalRequest, { foreignKey: 'userId', as: 'withdrawalRequests' });
WithdrawalRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Retailer.hasMany(Advertisement, { foreignKey: 'retailerId', as: 'advertisements' });
Advertisement.belongsTo(Retailer, { foreignKey: 'retailerId', as: 'retailer' });
Advertisement.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Advertisement.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

Banner.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

User.belongsToMany(Retailer, { through: RetailerFollower, foreignKey: 'customerId', as: 'followedRetailers' });
Retailer.belongsToMany(User, { through: RetailerFollower, foreignKey: 'retailerId', as: 'followers' });

User.belongsToMany(Retailer, { through: WishlistRetailer, foreignKey: 'userId', as: 'wishlistedRetailers' });
Retailer.belongsToMany(User, { through: WishlistRetailer, foreignKey: 'retailerId', as: 'wishlistedBy' });

Order.hasMany(OrderParcel, { foreignKey: 'orderId', as: 'parcels' });
OrderParcel.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(SupportTicket, { foreignKey: 'userId', as: 'supportTickets' });
SupportTicket.belongsTo(User, { foreignKey: 'userId', as: 'user' });

SupportTicket.hasMany(SupportTicketMessage, { foreignKey: 'ticketId', as: 'messages' });
SupportTicketMessage.belongsTo(SupportTicket, { foreignKey: 'ticketId', as: 'ticket' });
SupportTicketMessage.belongsTo(User, { foreignKey: 'userId', as: 'user' });

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
  // New Advtez models
  Branch,
  Brand,
  Discount,
  HotDeal,
  BankOffer,
  WalletTransaction,
  WithdrawalRequest,
  Advertisement,
  Banner,
  RetailerFollower,
  WishlistRetailer,
  OrderParcel,
  Notification,
  SupportTicket,
  SupportTicketMessage,
};


