const { Advertisement, Retailer } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');
const { Op } = require('sequelize');

/**
 * POST /api/ads/create
 * Create advertisement
 */
async function createAdvertisement(req, res, next) {
  try {
    const userId = req.user.id;
    const { type, categoryId, cityId, durationDays, designImageUrl, externalLink, description } = req.body;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    // Calculate price based on type and duration
    const pricing = {
      category_top: 500,
      discount_top: 300,
      deal: 200,
      home_banner: 1000,
    };

    const pricePerDay = pricing[type] || 200;
    const amountPaid = pricePerDay * durationDays;

    const advertisement = await Advertisement.create({
      retailerId: retailer.id,
      type,
      categoryId,
      cityId,
      durationDays,
      designImageUrl,
      externalLink,
      description,
      amountPaid,
      status: 'pending',
    });

    return apiSuccess(res, {
      message: 'Advertisement created successfully. Pending approval.',
      data: { advertisement, amountToPay: amountPaid },
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/ads/my-ads
 * Get retailer's advertisements
 */
async function getMyAdvertisements(req, res, next) {
  try {
    const userId = req.user.id;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const advertisements = await Advertisement.findAll({
      where: { retailerId: retailer.id },
      order: [['createdAt', 'DESC']],
    });

    return apiSuccess(res, {
      message: 'Advertisements retrieved',
      data: advertisements,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/ads/:id/report
 * Get advertisement report (impressions, clicks)
 */
async function getAdvertisementReport(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const ad = await Advertisement.findOne({ where: { id, retailerId: retailer.id } });
    if (!ad) {
      return apiError(res, 'Advertisement not found', 404);
    }

    const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0;

    return apiSuccess(res, {
      message: 'Advertisement report',
      data: {
        id: ad.id,
        type: ad.type,
        impressions: ad.impressions,
        clicks: ad.clicks,
        ctr: `${ctr}%`,
        startDate: ad.startDate,
        endDate: ad.endDate,
        status: ad.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/ads/:id/cancel
 * Cancel advertisement
 */
async function cancelAdvertisement(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const ad = await Advertisement.findOne({ where: { id, retailerId: retailer.id } });
    if (!ad) {
      return apiError(res, 'Advertisement not found', 404);
    }

    if (ad.status === 'active') {
      return apiError(res, 'Cannot cancel active advertisement. Please contact support.', 400);
    }

    await ad.update({ status: 'cancelled' });

    return apiSuccess(res, {
      message: 'Advertisement cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAdvertisement,
  getMyAdvertisements,
  getAdvertisementReport,
  cancelAdvertisement,
};
