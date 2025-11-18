const { Order, OrderParcel, User, Retailer } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');
const { generateOrderNumber } = require('../utils/helpers');
const { createNotification } = require('./notificationController');
const { creditWallet } = require('./walletController');

/**
 * POST /api/orders/:id/parcel
 * Create parcel for order
 */
async function createOrderParcel(req, res, next) {
  try {
    const { id } = req.params;
    const { title, trackingNumber, courierName } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return apiError(res, 'Order not found', 404);
    }

    const parcel = await OrderParcel.create({
      orderId: id,
      title,
      trackingNumber,
      courierName,
      status: 'preparing',
    });

    return apiSuccess(res, {
      message: 'Parcel created successfully',
      data: parcel,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/orders/:id/parcels
 * Get order parcels
 */
async function getOrderParcels(req, res, next) {
  try {
    const { id } = req.params;

    const parcels = await OrderParcel.findAll({
      where: { orderId: id },
      order: [['createdAt', 'DESC']],
    });

    return apiSuccess(res, {
      message: 'Order parcels retrieved',
      data: parcels,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/orders/:id/parcels/:parcelId
 * Update parcel status
 */
async function updateParcelStatus(req, res, next) {
  try {
    const { id, parcelId } = req.params;
    const { status, trackingNumber, courierName } = req.body;

    const parcel = await OrderParcel.findOne({ where: { id: parcelId, orderId: id } });
    if (!parcel) {
      return apiError(res, 'Parcel not found', 404);
    }

    const updates = { status };
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    if (courierName) updates.courierName = courierName;

    if (status === 'shipped') {
      updates.shippedAt = new Date();
    } else if (status === 'delivered') {
      updates.deliveredAt = new Date();
    }

    await parcel.update(updates);

    // Update order status if all parcels delivered
    if (status === 'delivered') {
      const allParcels = await OrderParcel.findAll({ where: { orderId: id } });
      const allDelivered = allParcels.every(p => p.status === 'delivered');

      if (allDelivered) {
        const order = await Order.findByPk(id);
        await order.update({ status: 'delivered' });

        // Send notification to customer
        await createNotification(
          order.userId,
          'order',
          'Order Delivered',
          `Your order ${order.orderNumber} has been delivered successfully.`,
          { orderId: order.id }
        );
      }
    }

    return apiSuccess(res, {
      message: 'Parcel status updated successfully',
      data: parcel,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/orders/:id/return
 * Request order return
 */
async function requestReturn(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ where: { id, userId } });
    if (!order) {
      return apiError(res, 'Order not found', 404);
    }

    if (order.status !== 'delivered') {
      return apiError(res, 'Only delivered orders can be returned', 400);
    }

    if (order.returnRequested) {
      return apiError(res, 'Return already requested for this order', 400);
    }

    await order.update({
      returnRequested: true,
      returnReason: reason,
      returnStatus: 'requested',
    });

    // Send notification
    await createNotification(
      userId,
      'order',
      'Return Request Submitted',
      `Your return request for order ${order.orderNumber} has been submitted.`,
      { orderId: order.id }
    );

    return apiSuccess(res, {
      message: 'Return request submitted successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/orders/:id/cancel
 * Cancel order
 */
async function cancelOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ where: { id, userId } });
    if (!order) {
      return apiError(res, 'Order not found', 404);
    }

    if (['delivered', 'shipped', 'cancelled'].includes(order.status)) {
      return apiError(res, 'Cannot cancel order in current status', 400);
    }

    await order.update({
      status: 'cancelled',
      notes: reason || 'Cancelled by customer',
    });

    // Refund to wallet if prepaid
    if (order.paymentMethod === 'prepaid' || order.paymentMethod === 'wallet') {
      await creditWallet(
        userId,
        order.total,
        'refund',
        `Refund for cancelled order ${order.orderNumber}`,
        order.id
      );
    }

    // Send notification
    await createNotification(
      userId,
      'order',
      'Order Cancelled',
      `Your order ${order.orderNumber} has been cancelled. Refund will be processed if applicable.`,
      { orderId: order.id }
    );

    return apiSuccess(res, {
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/orders/:id/return/approve
 * Approve return request
 */
async function approveReturn(req, res, next) {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return apiError(res, 'Order not found', 404);
    }

    await order.update({ returnStatus: 'approved' });

    // Process refund
    await creditWallet(
      order.userId,
      order.total,
      'refund',
      `Refund for returned order ${order.orderNumber}`,
      order.id
    );

    // Send notification
    await createNotification(
      order.userId,
      'order',
      'Return Approved',
      `Your return request for order ${order.orderNumber} has been approved. Refund credited to your wallet.`,
      { orderId: order.id }
    );

    return apiSuccess(res, {
      message: 'Return approved and refund processed',
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrderParcel,
  getOrderParcels,
  updateParcelStatus,
  requestReturn,
  cancelOrder,
  approveReturn,
};
