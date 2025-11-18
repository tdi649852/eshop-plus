const { sequelize, Order, OrderItem, OrderStatusHistory, Product, ProductVariant, Retailer, Address } = require('../models');
const { ORDER_STATUS } = require('../utils/constants');

async function createOrder(payload) {
  return sequelize.transaction(async (transaction) => {
    const order = await Order.create(
      {
        userId: payload.userId,
        addressId: payload.addressId,
        cityId: payload.cityId,
        paymentMethod: payload.paymentMethod,
        subtotal: payload.subtotal,
        discount: payload.discount,
        deliveryFee: payload.deliveryFee,
        total: payload.total,
        notes: payload.notes,
      },
      { transaction },
    );

    await OrderItem.bulkCreate(
      payload.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        productVariantId: item.productVariantId,
        retailerId: item.retailerId,
        quantity: item.quantity,
        price: item.price,
        status: ORDER_STATUS.PENDING,
      })),
      { transaction },
    );

    await OrderStatusHistory.create(
      {
        orderId: order.id,
        status: ORDER_STATUS.PENDING,
        remarks: 'Order placed',
      },
      { transaction },
    );

    return Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }, { model: ProductVariant, as: 'variant' }, { model: Retailer, as: 'retailer' }] },
        { model: Address, as: 'shippingAddress' },
      ],
      transaction,
    });
  });
}

async function listOrdersForUser(userId) {
  return Order.findAll({
    where: { userId },
    include: [
      { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }, { model: Retailer, as: 'retailer' }] },
      { model: Address, as: 'shippingAddress' },
      { model: OrderStatusHistory, as: 'statusHistory' },
    ],
    order: [['createdAt', 'DESC']],
  });
}

async function listOrdersForRetailer(retailerId) {
  return Order.findAll({
    include: [
      {
        model: OrderItem,
        as: 'items',
        where: { retailerId },
        required: true,
        include: [{ model: Product, as: 'product' }],
      },
      { model: OrderStatusHistory, as: 'statusHistory' },
    ],
  });
}

async function listOrdersForAdmin() {
  return Order.findAll({
    include: [
      { model: OrderItem, as: 'items' },
      { model: OrderStatusHistory, as: 'statusHistory' },
    ],
  });
}

async function updateOrderStatus(orderId, status, userId) {
  await Order.update({ status }, { where: { id: orderId } });
  await OrderStatusHistory.create({ orderId, status, changedBy: userId, remarks: `Status changed to ${status}` });
  return Order.findByPk(orderId, {
    include: [
      { model: OrderItem, as: 'items' },
      { model: OrderStatusHistory, as: 'statusHistory' },
    ],
  });
}

module.exports = {
  createOrder,
  listOrdersForUser,
  listOrdersForRetailer,
  listOrdersForAdmin,
  updateOrderStatus,
};


