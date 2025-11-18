const { Retailer, Product, Category, Banner, HotDeal, City, ProductImage } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');
const { calculateDistance } = require('../utils/helpers');
const { Op } = require('sequelize');

/**
 * GET /api/home
 * Get home page data: featured retailers, categories, hot deals, nearby retailers
 */
async function getHomeData(req, res, next) {
  try {
    const { cityId, latitude, longitude } = req.query;

    // Get active banners
    const banners = await Banner.findAll({
      where: {
        isActive: true,
        [Op.or]: [{ cityId }, { cityId: null }],
        [Op.or]: [
          { startDate: null },
          { startDate: { [Op.lte]: new Date() } },
        ],
        [Op.or]: [
          { endDate: null },
          { endDate: { [Op.gte]: new Date() } },
        ],
      },
      order: [['displayOrder', 'ASC']],
      limit: 5,
    });

    // Get featured retailers
    const featuredRetailers = await Retailer.findAll({
      where: {
        isFeatured: true,
        status: 'approved',
        ...(cityId && { cityId }),
      },
      limit: 10,
      order: [['followersCount', 'DESC']],
    });

    // Get product categories
    const categories = await Category.findAll({
      where: { isActive: true, parentId: null },
      limit: 12,
    });

    // Get hot deals
    const hotDeals = await HotDeal.findAll({
      where: {
        isActive: true,
        validityEnd: { [Op.gte]: new Date() },
      },
      include: [
        {
          model: Retailer,
          as: 'retailer',
          where: { status: 'approved', ...(cityId && { cityId }) },
          attributes: ['id', 'storeName', 'logoUrl'],
        },
      ],
      limit: 10,
      order: [['createdAt', 'DESC']],
    });

    // Get nearby retailers if location provided
    let nearbyRetailers = [];
    if (latitude && longitude) {
      const allRetailers = await Retailer.findAll({
        where: { status: 'approved', latitude: { [Op.ne]: null }, longitude: { [Op.ne]: null } },
        limit: 50,
      });

      nearbyRetailers = allRetailers
        .map(r => ({
          ...r.toJSON(),
          distance: calculateDistance(latitude, longitude, r.latitude, r.longitude),
        }))
        .filter(r => r.distance <= r.deliveryRadiusKm)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);
    }

    return apiSuccess(res, {
      message: 'Home data retrieved',
      data: {
        banners,
        featuredRetailers,
        categories,
        hotDeals,
        nearbyRetailers,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/explore/retailers
 * Explore retailers with filters
 */
async function exploreRetailers(req, res, next) {
  try {
    const { cityId, categoryId, discountActive, latitude, longitude, page = 1, limit = 20 } = req.query;

    const where = { status: 'approved' };
    if (cityId) where.cityId = cityId;
    if (discountActive === 'true') where.discountEnabled = true;

    const offset = (page - 1) * limit;

    const { count, rows: retailers } = await Retailer.findAndCountAll({
      where,
      include: categoryId ? [
        {
          model: Product,
          as: 'products',
          where: { categoryId },
          required: true,
          attributes: [],
        },
      ] : [],
      distinct: true,
      limit: parseInt(limit),
      offset,
      order: [['followersCount', 'DESC']],
    });

    // Calculate distance if location provided
    let retailersWithDistance = retailers;
    if (latitude && longitude) {
      retailersWithDistance = retailers.map(r => ({
        ...r.toJSON(),
        distance: r.latitude && r.longitude
          ? calculateDistance(latitude, longitude, r.latitude, r.longitude)
          : null,
      }));
    }

    return apiSuccess(res, {
      message: 'Retailers retrieved',
      data: retailersWithDistance,
      pagination: {
        page: parseInt(page),
        perPage: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/retailers/:id/profile
 * Get public retailer profile
 */
async function getRetailerPublicProfile(req, res, next) {
  try {
    const { id } = req.params;

    const retailer = await Retailer.findOne({
      where: { id, status: 'approved' },
      include: [
        {
          model: Product,
          as: 'products',
          where: { isPublished: true },
          required: false,
          include: [{ model: ProductImage, as: 'images' }],
        },
      ],
    });

    if (!retailer) {
      return apiError(res, 'Retailer not found', 404);
    }

    return apiSuccess(res, {
      message: 'Retailer profile retrieved',
      data: retailer,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/search
 * Unified search for products, retailers
 */
async function unifiedSearch(req, res, next) {
  try {
    const { q, type = 'all', cityId, page = 1, limit = 20 } = req.query;

    if (!q || q.length < 2) {
      return apiError(res, 'Search query too short', 400);
    }

    const offset = (page - 1) * limit;
    const results = {};

    if (type === 'all' || type === 'products') {
      const products = await Product.findAll({
        where: {
          isPublished: true,
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { nameHi: { [Op.like]: `%${q}%` } },
            { description: { [Op.like]: `%${q}%` } },
          ],
          ...(cityId && { cityId }),
        },
        include: [
          { model: ProductImage, as: 'images' },
          { model: Retailer, as: 'retailer', attributes: ['id', 'storeName'] },
        ],
        limit: parseInt(limit),
        offset,
      });
      results.products = products;
    }

    if (type === 'all' || type === 'retailers') {
      const retailers = await Retailer.findAll({
        where: {
          status: 'approved',
          [Op.or]: [
            { storeName: { [Op.like]: `%${q}%` } },
            { brandName: { [Op.like]: `%${q}%` } },
            { description: { [Op.like]: `%${q}%` } },
          ],
          ...(cityId && { cityId }),
        },
        limit: parseInt(limit),
        offset,
      });
      results.retailers = retailers;
    }

    return apiSuccess(res, {
      message: 'Search results',
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHomeData,
  exploreRetailers,
  getRetailerPublicProfile,
  unifiedSearch,
};
