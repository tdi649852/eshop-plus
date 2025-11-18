const { Order, OrderItem, Product, Category, Retailer, sequelize } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

/**
 * GET /api/retailer/analytics
 * Get retailer analytics
 */
async function getRetailerAnalytics(req, res, next) {
  try {
    const userId = req.user.id;
    const { period = 'today' } = req.query; // today, weekly, monthly

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    let startDate;
    const endDate = new Date();

    switch (period) {
      case 'today':
        startDate = dayjs().startOf('day').toDate();
        break;
      case 'weekly':
        startDate = dayjs().subtract(7, 'days').startOf('day').toDate();
        break;
      case 'monthly':
        startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
        break;
      default:
        startDate = dayjs().startOf('day').toDate();
    }

    // Get orders in period
    const orders = await Order.findAll({
      where: {
        retailerId: retailer.id,
        createdAt: { [Op.between]: [startDate, endDate] },
        status: { [Op.ne]: 'cancelled' },
      },
    });

    // Calculate total sales
    const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);

    // Calculate commission earned
    const commissionEarned = orders.reduce((sum, order) => sum + parseFloat(order.commissionAmount), 0);

    // Get sales by day for chart
    const salesByDay = await Order.findAll({
      where: {
        retailerId: retailer.id,
        createdAt: { [Op.between]: [startDate, endDate] },
        status: { [Op.ne]: 'cancelled' },
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      raw: true,
    });

    // Get most selling category
    const categoryStats = await OrderItem.findAll({
      where: {
        retailerId: retailer.id,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('order_items.id')), 'itemCount'],
      ],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['categoryId'],
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      group: ['product.category_id'],
      order: [[sequelize.fn('COUNT', sequelize.col('order_items.id')), 'DESC']],
      limit: 1,
      raw: true,
    });

    return apiSuccess(res, {
      message: 'Analytics retrieved',
      data: {
        period,
        totalSales: totalSales.toFixed(2),
        totalOrders: orders.length,
        commissionEarned: commissionEarned.toFixed(2),
        salesByDay,
        mostSellingCategory: categoryStats[0] || null,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRetailerAnalytics,
};
