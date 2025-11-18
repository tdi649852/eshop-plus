const { Discount, HotDeal, BankOffer, Retailer, Product, Category } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');
const { Op } = require('sequelize');

/**
 * POST /api/retailer/discount/hot-deal
 * Create hot deal
 */
async function createHotDeal(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, description, imageUrl, externalLink, validityStart, validityEnd } = req.body;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const hotDeal = await HotDeal.create({
      retailerId: retailer.id,
      name,
      description,
      imageUrl,
      externalLink,
      validityStart,
      validityEnd,
      isActive: true,
    });

    return apiSuccess(res, {
      message: 'Hot deal created successfully',
      data: hotDeal,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/retailer/discount/hot-deals
 * Get all hot deals for retailer
 */
async function getHotDeals(req, res, next) {
  try {
    const userId = req.user.id;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const hotDeals = await HotDeal.findAll({
      where: { retailerId: retailer.id },
      order: [['createdAt', 'DESC']],
    });

    return apiSuccess(res, {
      message: 'Hot deals retrieved',
      data: hotDeals,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/retailer/discount/hot-deal/:id
 * Update hot deal
 */
async function updateHotDeal(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updates = req.body;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const hotDeal = await HotDeal.findOne({ where: { id, retailerId: retailer.id } });
    if (!hotDeal) {
      return apiError(res, 'Hot deal not found', 404);
    }

    await hotDeal.update(updates);

    return apiSuccess(res, {
      message: 'Hot deal updated successfully',
      data: hotDeal,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/retailer/discount/hot-deal/:id
 * Delete hot deal
 */
async function deleteHotDeal(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const hotDeal = await HotDeal.findOne({ where: { id, retailerId: retailer.id } });
    if (!hotDeal) {
      return apiError(res, 'Hot deal not found', 404);
    }

    await hotDeal.destroy();

    return apiSuccess(res, {
      message: 'Hot deal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/retailer/discount/category
 * Create category discount
 */
async function createCategoryDiscount(req, res, next) {
  try {
    const userId = req.user.id;
    const { categoryIds, discountPercentage, validityStart, validityEnd } = req.body;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const discount = await Discount.create({
      retailerId: retailer.id,
      type: 'category',
      discountType: 'percentage',
      value: discountPercentage,
      applicableTo: categoryIds,
      validityStart,
      validityEnd,
      isActive: true,
    });

    return apiSuccess(res, {
      message: 'Category discount created successfully',
      data: discount,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/retailer/discount/categories
 * Get category discounts
 */
async function getCategoryDiscounts(req, res, next) {
  try {
    const userId = req.user.id;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const discounts = await Discount.findAll({
      where: { retailerId: retailer.id, type: 'category' },
      order: [['createdAt', 'DESC']],
    });

    return apiSuccess(res, {
      message: 'Category discounts retrieved',
      data: discounts,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/retailer/discount/product
 * Create product discount
 */
async function createProductDiscount(req, res, next) {
  try {
    const userId = req.user.id;
    const { productIds, discountPercentage, fixedPrice, validityStart, validityEnd } = req.body;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const discount = await Discount.create({
      retailerId: retailer.id,
      type: 'product',
      discountType: fixedPrice ? 'fixed_price' : 'percentage',
      value: fixedPrice || discountPercentage,
      applicableTo: productIds,
      validityStart,
      validityEnd,
      isActive: true,
    });

    return apiSuccess(res, {
      message: 'Product discount created successfully',
      data: discount,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/retailer/discount/products
 * Get product discounts
 */
async function getProductDiscounts(req, res, next) {
  try {
    const userId = req.user.id;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const discounts = await Discount.findAll({
      where: { retailerId: retailer.id, type: 'product' },
      order: [['createdAt', 'DESC']],
    });

    return apiSuccess(res, {
      message: 'Product discounts retrieved',
      data: discounts,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/retailer/discount/bank-offer
 * Create bank offer
 */
async function createBankOffer(req, res, next) {
  try {
    const userId = req.user.id;
    const { bankName, offerDetails, discountPercentage, validityStart, validityEnd, termsConditions } = req.body;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const bankOffer = await BankOffer.create({
      retailerId: retailer.id,
      bankName,
      offerDetails,
      discountPercentage,
      validityStart,
      validityEnd,
      termsConditions,
      isActive: true,
    });

    return apiSuccess(res, {
      message: 'Bank offer created successfully',
      data: bankOffer,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/retailer/discount/bank-offers
 * Get bank offers
 */
async function getBankOffers(req, res, next) {
  try {
    const userId = req.user.id;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const bankOffers = await BankOffer.findAll({
      where: { retailerId: retailer.id },
      order: [['createdAt', 'DESC']],
    });

    return apiSuccess(res, {
      message: 'Bank offers retrieved',
      data: bankOffers,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/deals
 * Get all platform deals (customer view)
 */
async function getAllDeals(req, res, next) {
  try {
    const { city, category } = req.query;
    const where = { isActive: true, validityEnd: { [Op.gte]: new Date() } };

    let hotDeals = await HotDeal.findAll({
      where,
      include: [
        {
          model: Retailer,
          as: 'retailer',
          attributes: ['id', 'storeName', 'cityId'],
          where: city ? { cityId: city } : {},
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    return apiSuccess(res, {
      message: 'Deals retrieved',
      data: hotDeals,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createHotDeal,
  getHotDeals,
  updateHotDeal,
  deleteHotDeal,
  createCategoryDiscount,
  getCategoryDiscounts,
  createProductDiscount,
  getProductDiscounts,
  createBankOffer,
  getBankOffers,
  getAllDeals,
};
