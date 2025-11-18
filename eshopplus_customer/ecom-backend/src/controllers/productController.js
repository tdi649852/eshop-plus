const path = require('path');
const catchAsync = require('../utils/catchAsync');
const { apiSuccess } = require('../utils/apiResponse');
const productService = require('../services/productService');
const env = require('../config/env');

function toPublicPath(filePath) {
  const relative = path.relative(env.uploadsDir, filePath);
  return `/uploads/${relative.replace(/\\/g, '/')}`;
}

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.user, req.body);
  return apiSuccess(res, { statusCode: 201, message: 'Product created', data: product });
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.user, req.params.id, req.body);
  return apiSuccess(res, { message: 'Product updated', data: product });
});

const listProducts = catchAsync(async (req, res) => {
  const result = await productService.listProducts(req.cityId, req);
  return apiSuccess(res, { data: result.items, meta: result.meta });
});

const uploadImages = catchAsync(async (req, res) => {
  const imageUrls = (req.files || []).map((file) => toPublicPath(file.path));
  const product = await productService.addImages(req.params.id, imageUrls);
  return apiSuccess(res, { message: 'Images uploaded', data: product });
});

module.exports = {
  createProduct,
  updateProduct,
  listProducts,
  uploadImages,
};


