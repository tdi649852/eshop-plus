const ApiError = require('../utils/apiError');
const productRepository = require('../repositories/productRepository');
const retailerRepository = require('../repositories/retailerRepository');
const { getPaginationParams, buildMeta } = require('../utils/pagination');
const slugify = require('../utils/slugify');

async function ensureRetailerOwnership(user) {
  const retailer = await retailerRepository.findRetailerByUser(user.id);
  if (!retailer) {
    throw new ApiError(403, 'Retailer profile missing');
  }
  return retailer;
}

async function createProduct(user, payload) {
  const retailer = await ensureRetailerOwnership(user);
  const product = await productRepository.createProduct(
    {
      retailerId: retailer.id,
      categoryId: payload.categoryId,
      cityId: retailer.cityId,
      name: payload.name,
      slug: payload.slug || `${slugify(payload.name)}-${Date.now()}`,
      sku: payload.sku,
      description: payload.description,
      unit: payload.unit,
      basePrice: payload.basePrice,
      salePrice: payload.salePrice,
      stock: payload.stock,
      isPublished: payload.isPublished ?? false,
      isFeatured: payload.isFeatured ?? false,
      maxOrderQuantity: payload.maxOrderQuantity,
      discountType: payload.discountType,
      discountValue: payload.discountValue,
    },
    {
      variants: payload.variants || [],
      images: (payload.images || []).map((imageUrl, index) => ({
        imageUrl,
        isPrimary: index === 0,
      })),
    },
  );
  return product;
}

async function updateProduct(user, productId, payload) {
  const retailer = await ensureRetailerOwnership(user);
  const product = await productRepository.findProductById(productId);
  if (!product || product.retailerId !== retailer.id) {
    throw new ApiError(404, 'Product not found');
  }
  return productRepository.updateProduct(productId, payload);
}

async function listProducts(cityId, req) {
  const pagination = getPaginationParams(req);
  const filters = {
    search: req.query.search,
    categoryId: req.query.categoryId,
    retailerId: req.query.retailerId,
  };
  const result = await productRepository.listProductsByCity(cityId, filters, pagination);
  return {
    items: result.rows,
    meta: buildMeta({ total: result.count, page: pagination.page, limit: pagination.limit }),
  };
}

async function addImages(productId, images) {
  const product = await productRepository.findProductById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return productRepository.addProductImages(productId, images);
}

module.exports = {
  createProduct,
  updateProduct,
  listProducts,
  addImages,
};


