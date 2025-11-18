const { Retailer, User, Branch, RetailerFollower, Product, Order, WalletTransaction, Discount, HotDeal, BankOffer } = require('../models');
const { apiSuccess, apiError } = require('../utils/apiResponse');
const { generateRetailerUniqueId, slugify } = require('../utils/helpers');
const { Op } = require('sequelize');

/**
 * POST /api/retailer/onboard
 * Onboard new retailer with business details, KYC, and brand info
 */
async function onboardRetailer(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      storeName,
      businessType,
      gstNumber,
      panNumber,
      brandName,
      categoryIds,
      addressLine1,
      addressLine2,
      cityId,
      pincode,
      latitude,
      longitude,
      phone,
      description,
    } = req.body;

    // Check if user already has a retailer profile
    const existingRetailer = await Retailer.findOne({ where: { userId } });
    if (existingRetailer) {
      return apiError(res, 'Retailer profile already exists', 400);
    }

    // Generate unique ID
    const uniqueId = generateRetailerUniqueId();
    const slug = slugify(`${storeName}-${Date.now()}`);

    // Create retailer
    const retailer = await Retailer.create({
      userId,
      uniqueId,
      storeName,
      businessType,
      brandName,
      slug,
      gstNumber,
      panNumber,
      phone,
      addressLine1,
      addressLine2,
      cityId,
      pincode,
      latitude,
      longitude,
      description,
      status: 'pending',
      kycStatus: 'pending',
    });

    // Update user role to retailer
    await User.update({ role: 'retailer' }, { where: { id: userId } });

    return apiSuccess(res, {
      message: 'Retailer onboarding request submitted successfully',
      data: retailer,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/retailer/profile
 * Get retailer profile with all details
 */
async function getRetailerProfile(req, res, next) {
  try {
    const userId = req.user.id;

    const retailer = await Retailer.findOne({
      where: { userId },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Branch, as: 'branches' },
      ],
    });

    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    // Get follower count
    const followersCount = await RetailerFollower.count({ where: { retailerId: retailer.id } });

    return apiSuccess(res, {
      message: 'Retailer profile retrieved',
      data: { ...retailer.toJSON(), followersCount },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/retailer/profile
 * Update retailer profile (requires admin approval for certain changes)
 */
async function updateRetailerProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    // Fields that require approval
    const approvalRequired = ['businessType', 'gstNumber', 'panNumber'];
    const needsApproval = approvalRequired.some(field => updates[field]);

    if (needsApproval) {
      updates.status = 'pending';
      updates.verificationNotes = 'Profile update pending approval';
    }

    await retailer.update(updates);

    return apiSuccess(res, {
      message: needsApproval
        ? 'Profile update submitted for approval'
        : 'Profile updated successfully',
      data: retailer,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/retailer/branch
 * Add new branch
 */
async function createBranch(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, mobile, addressLine1, addressLine2, cityId, pincode, latitude, longitude, images } = req.body;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const branch = await Branch.create({
      retailerId: retailer.id,
      name,
      mobile,
      addressLine1,
      addressLine2,
      cityId,
      pincode,
      latitude,
      longitude,
      images: images || [],
      status: 'pending',
    });

    return apiSuccess(res, {
      message: 'Branch added successfully. Pending approval.',
      data: branch,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/retailer/branches
 * Get all branches
 */
async function getBranches(req, res, next) {
  try {
    const userId = req.user.id;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const branches = await Branch.findAll({ where: { retailerId: retailer.id } });

    return apiSuccess(res, {
      message: 'Branches retrieved',
      data: branches,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/retailer/branch/:id
 * Update branch
 */
async function updateBranch(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updates = req.body;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const branch = await Branch.findOne({ where: { id, retailerId: retailer.id } });
    if (!branch) {
      return apiError(res, 'Branch not found', 404);
    }

    await branch.update(updates);

    return apiSuccess(res, {
      message: 'Branch updated successfully',
      data: branch,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/retailer/followers
 * Get followers list
 */
async function getFollowers(req, res, next) {
  try {
    const userId = req.user.id;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    const followers = await RetailerFollower.findAll({
      where: { retailerId: retailer.id },
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return apiSuccess(res, {
      message: 'Followers retrieved',
      data: {
        count: followers.length,
        followers: followers.map(f => f.customer),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/retailer/discount/toggle
 * Toggle discount ON/OFF for all discounts
 */
async function toggleDiscounts(req, res, next) {
  try {
    const userId = req.user.id;
    const { enabled } = req.body;

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    await retailer.update({ discountEnabled: enabled });

    return apiSuccess(res, {
      message: `Discounts ${enabled ? 'enabled' : 'disabled'} successfully`,
      data: { discountEnabled: enabled },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/retailer/discount/store
 * Set overall store discount percentage
 */
async function setStoreDiscount(req, res, next) {
  try {
    const userId = req.user.id;
    const { discountPercentage } = req.body;

    if (discountPercentage < 0 || discountPercentage > 100) {
      return apiError(res, 'Invalid discount percentage', 400);
    }

    const retailer = await Retailer.findOne({ where: { userId } });
    if (!retailer) {
      return apiError(res, 'Retailer profile not found', 404);
    }

    await retailer.update({ storeDiscountPercentage: discountPercentage });

    return apiSuccess(res, {
      message: 'Store-wide discount updated successfully',
      data: { storeDiscountPercentage: discountPercentage },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  onboardRetailer,
  getRetailerProfile,
  updateRetailerProfile,
  createBranch,
  getBranches,
  updateBranch,
  getFollowers,
  toggleDiscounts,
  setStoreDiscount,
};
