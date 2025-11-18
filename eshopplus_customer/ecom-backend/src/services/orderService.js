const ApiError = require('../utils/apiError');
const { USER_ROLES, ORDER_STATUS } = require('../utils/constants');
const orderRepository = require('../repositories/orderRepository');
const cartRepository = require('../repositories/cartRepository');
const { Product, ProductVariant, Address, Retailer, Order, OrderItem } = require('../models');

async function ensureAddress(addressId, userId) {
  const address = await Address.findOne({ where: { id: addressId, userId } });
  if (!address) {
    throw new ApiError(404, 'Address not found');
  }
  return address;
}

async function normalizeOrderItems(items, cityId) {
  const normalized = [];
  for (const item of items) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.findOne({
      where: { id: item.productId, cityId, isPublished: true },
      include: [{ model: Retailer, as: 'retailer' }],
    });
    if (!product) {
      throw new ApiError(404, 'One or more products unavailable in selected city');
    }
    let price = Number(product.salePrice || product.basePrice);
    if (item.productVariantId) {
      // eslint-disable-next-line no-await-in-loop
      const variant = await ProductVariant.findOne({
        where: { id: item.productVariantId, productId: product.id },
      });
      if (!variant) {
        throw new ApiError(404, 'Product variant invalid');
      }
      price = Number(variant.salePrice || variant.price);
    }
    normalized.push({
      productId: product.id,
      productVariantId: item.productVariantId,
      retailerId: product.retailerId,
      quantity: item.quantity,
      price,
    });
  }
  return normalized;
}

async function placeOrder(user, cityId, payload) {
  const address = await ensureAddress(payload.addressId, user.id);
  const items = await normalizeOrderItems(payload.items, cityId);
  if (!items.length) {
    throw new ApiError(400, 'Order requires at least one item');
  }
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = payload.discount || 0;
  const deliveryFee = payload.deliveryFee || 0;
  const total = subtotal - discount + deliveryFee;

  const order = await orderRepository.createOrder({
    userId: user.id,
    addressId: address.id,
    cityId,
    paymentMethod: payload.paymentMethod || 'cod',
    subtotal,
    discount,
    deliveryFee,
    total,
    notes: payload.notes,
    items,
  });

  await cartRepository.clearCartByUser(user.id);
  return order;
}

async function listOrders(user) {
  if (user.role === USER_ROLES.ADMIN) {
    return orderRepository.listOrdersForAdmin();
  }
  if (user.role === USER_ROLES.RETAILER) {
    const retailer = await Retailer.findOne({ where: { userId: user.id } });
    if (!retailer) {
      throw new ApiError(404, 'Retailer profile missing');
    }
    return orderRepository.listOrdersForRetailer(retailer.id);
  }
  return orderRepository.listOrdersForUser(user.id);
}

async function updateOrderStatus(user, orderId, status) {
  if (!Object.values(ORDER_STATUS).includes(status)) {
    throw new ApiError(422, 'Invalid status value');
  }
  if (user.role === USER_ROLES.CUSTOMER) {
    throw new ApiError(403, 'Customers cannot change order status');
  }
  if (user.role === USER_ROLES.RETAILER) {
    const retailer = await Retailer.findOne({ where: { userId: user.id } });
    if (!retailer) {
      throw new ApiError(404, 'Retailer profile missing');
    }
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: 'items' }],
    });
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    const ownsItems = order.items.some((item) => item.retailerId === retailer.id);
    if (!ownsItems) {
      throw new ApiError(403, 'You cannot update orders for other retailers');
    }
  }
  return orderRepository.updateOrderStatus(orderId, status, user.id);
}

module.exports = {
  placeOrder,
  listOrders,
  updateOrderStatus,
};


