const { Retailer, City, User } = require('../models');
const { RETAILER_STATUS } = require('../utils/constants');
const { resolveLegacyCity, buildLegacyPlaceholder } = require('../utils/legacyCompat');
const { loadMock } = require('../../utils/mockLoader');

function resolveLimit(value, fallback = 10, max = 20) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function resolveOffset(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
}

async function getCityIdForLegacyConfig(legacyCity) {
  if (!legacyCity) return null;
  const city = await City.findOne({ where: { name: legacyCity.name } });
  return city?.id ?? null;
}

function buildSellerResponse(retailer, legacyCity) {
  const owner = retailer.owner || {};
  const fullName = [owner.firstName, owner.lastName].filter(Boolean).join(' ').trim();
  const displayName = fullName || retailer.storeName || retailer.slug;
  const placeholderCity = legacyCity || null;
  const fallbackLogo = buildLegacyPlaceholder(
    placeholderCity,
    240,
    240,
    retailer.storeName || 'Retailer',
  );
  const logoUrl =
    (retailer.logoUrl && /^https?:\/\//i.test(retailer.logoUrl)
      ? retailer.logoUrl
      : fallbackLogo) || fallbackLogo;

  return {
    seller_id: retailer.id,
    user_id: retailer.userId,
    seller_name: displayName,
    email: owner.email || null,
    mobile: owner.phone || null,
    slug: retailer.slug,
    rating: Number(retailer.rating || 0),
    no_of_ratings: Number(retailer.noOfRatings || 0),
    store_name: retailer.storeName,
    store_url: '',
    store_description: retailer.description || '',
    store_logo: logoUrl,
    balance: '0',
    total_products: Number(retailer.dataValues.productCount || 0),
    is_favorite: 0,
  };
}

const getSellers = async (req, res, next) => {
  try {
    const params = { ...req.query, ...req.body };
    const legacyCity = resolveLegacyCity(params, req.headers);
    const cityId = await getCityIdForLegacyConfig(legacyCity);
    const limit = resolveLimit(params.limit);
    const offset = resolveOffset(params.offset);

    const where = {
      status: RETAILER_STATUS.APPROVED,
    };

    if (cityId) {
      where.cityId = cityId;
    }

    const retailers = await Retailer.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
      ],
      attributes: {
        include: [
          [
            Retailer.sequelize.literal(`(
              SELECT COUNT(*)
              FROM products AS products
              WHERE products.retailer_id = ${Retailer.getTableName()}.id
            )`),
            'productCount',
          ],
        ],
      },
      limit,
      offset,
      order: [
        ['createdAt', 'DESC'],
        ['storeName', 'ASC'],
      ],
    });

    const responseData = retailers.rows.map((retailer) =>
      buildSellerResponse(retailer, legacyCity),
    );

    if (!responseData.length) {
      const fallback = await loadMock('get_sellers', params, req.headers);
      return res.json(fallback);
    }

    return res.json({
      error: false,
      message: 'Seller retrieved successfully',
      language_message_key: 'seller_retrived_successfully',
      total: retailers.count,
      data: responseData,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getSellers,
};


