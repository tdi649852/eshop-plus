const { Retailer, User, Product, Category, Banner, Advertisement, SupportTicket, WithdrawalRequest } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');
const { slugify } = require('../utils/helpers');
const { Op } = require('sequelize');

/**
 * GET /api/admin/retailers/pending
 * Get pending retailer approvals
 */
async function getPendingRetailers(req, res, next) {
  try {
    const retailers = await Retailer.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }],
      order: [['createdAt', 'ASC']],
    });

    return apiSuccess(res, {
      message: 'Pending retailers retrieved',
      data: retailers,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/retailers/:id/approve
 * Approve retailer
 */
async function approveRetailer(req, res, next) {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const retailer = await Retailer.findByPk(id);
    if (!retailer) {
      return apiError(res, 'Retailer not found', 404);
    }

    await retailer.update({
      status: 'approved',
      kycStatus: 'verified',
      verificationNotes: notes || 'Approved by admin',
    });

    return apiSuccess(res, {
      message: 'Retailer approved successfully',
      data: retailer,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/retailers/:id/reject
 * Reject retailer
 */
async function rejectRetailer(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const retailer = await Retailer.findByPk(id);
    if (!retailer) {
      return apiError(res, 'Retailer not found', 404);
    }

    await retailer.update({
      status: 'rejected',
      kycStatus: 'rejected',
      verificationNotes: reason || 'Rejected by admin',
    });

    return apiSuccess(res, {
      message: 'Retailer rejected',
      data: retailer,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/products/pending
 * Get pending product approvals
 */
async function getPendingProducts(req, res, next) {
  try {
    const products = await Product.findAll({
      where: { status: 'draft' },
      include: [{ model: Retailer, as: 'retailer', attributes: ['id', 'storeName'] }],
      order: [['createdAt', 'ASC']],
    });

    return apiSuccess(res, {
      message: 'Pending products retrieved',
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/products/:id/approve
 * Approve product
 */
async function approveProduct(req, res, next) {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return apiError(res, 'Product not found', 404);
    }

    await product.update({ status: 'published', isPublished: true });

    return apiSuccess(res, {
      message: 'Product approved successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/categories
 * Create category
 */
async function createCategory(req, res, next) {
  try {
    const { name, description, iconUrl, parentId } = req.body;

    const slug = slugify(name);

    const category = await Category.create({
      name,
      slug,
      description,
      iconUrl,
      parentId,
      isActive: true,
    });

    return apiSuccess(res, {
      message: 'Category created successfully',
      data: category,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/featured-retailer/:id
 * Mark retailer as featured
 */
async function setFeaturedRetailer(req, res, next) {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    const retailer = await Retailer.findByPk(id);
    if (!retailer) {
      return apiError(res, 'Retailer not found', 404);
    }

    await retailer.update({ isFeatured: featured !== false });

    return apiSuccess(res, {
      message: `Retailer ${featured ? 'marked as featured' : 'removed from featured'}`,
      data: retailer,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/banner
 * Create homepage banner
 */
async function createBanner(req, res, next) {
  try {
    const { title, imageUrl, linkUrl, linkType, linkId, cityId, displayOrder, startDate, endDate } = req.body;

    const banner = await Banner.create({
      title,
      imageUrl,
      linkUrl,
      linkType,
      linkId,
      cityId,
      displayOrder: displayOrder || 0,
      isActive: true,
      startDate,
      endDate,
    });

    return apiSuccess(res, {
      message: 'Banner created successfully',
      data: banner,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/banners
 * Get all banners
 */
async function getBanners(req, res, next) {
  try {
    const banners = await Banner.findAll({
      order: [['displayOrder', 'ASC']],
    });

    return apiSuccess(res, {
      message: 'Banners retrieved',
      data: banners,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/banners/:id
 * Update banner
 */
async function updateBanner(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const banner = await Banner.findByPk(id);
    if (!banner) {
      return apiError(res, 'Banner not found', 404);
    }

    await banner.update(updates);

    return apiSuccess(res, {
      message: 'Banner updated successfully',
      data: banner,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/banners/:id
 * Delete banner
 */
async function deleteBanner(req, res, next) {
  try {
    const { id } = req.params;

    const banner = await Banner.findByPk(id);
    if (!banner) {
      return apiError(res, 'Banner not found', 404);
    }

    await banner.destroy();

    return apiSuccess(res, {
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/advertisements/pending
 * Get pending advertisements
 */
async function getPendingAdvertisements(req, res, next) {
  try {
    const advertisements = await Advertisement.findAll({
      where: { status: 'pending' },
      include: [{ model: Retailer, as: 'retailer', attributes: ['id', 'storeName'] }],
      order: [['createdAt', 'ASC']],
    });

    return apiSuccess(res, {
      message: 'Pending advertisements retrieved',
      data: advertisements,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/advertisements/:id/approve
 * Approve advertisement
 */
async function approveAdvertisement(req, res, next) {
  try {
    const { id } = req.params;

    const ad = await Advertisement.findByPk(id);
    if (!ad) {
      return apiError(res, 'Advertisement not found', 404);
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + ad.durationDays);

    await ad.update({ status: 'active', startDate, endDate });

    return apiSuccess(res, {
      message: 'Advertisement approved and activated',
      data: ad,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/withdrawals/pending
 * Get pending withdrawal requests
 */
async function getPendingWithdrawals(req, res, next) {
  try {
    const withdrawals = await WithdrawalRequest.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }],
      order: [['createdAt', 'ASC']],
    });

    return apiSuccess(res, {
      message: 'Pending withdrawal requests retrieved',
      data: withdrawals,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/withdrawals/:id/approve
 * Approve withdrawal request
 */
async function approveWithdrawal(req, res, next) {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const withdrawal = await WithdrawalRequest.findByPk(id);
    if (!withdrawal) {
      return apiError(res, 'Withdrawal request not found', 404);
    }

    await withdrawal.update({
      status: 'approved',
      adminNotes: notes,
      processedAt: new Date(),
    });

    return apiSuccess(res, {
      message: 'Withdrawal request approved',
      data: withdrawal,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPendingRetailers,
  approveRetailer,
  rejectRetailer,
  getPendingProducts,
  approveProduct,
  createCategory,
  setFeaturedRetailer,
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
  getPendingAdvertisements,
  approveAdvertisement,
  getPendingWithdrawals,
  approveWithdrawal,
};
