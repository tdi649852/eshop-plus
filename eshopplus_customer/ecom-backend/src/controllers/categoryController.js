const catchAsync = require('../utils/catchAsync');
const { apiSuccess } = require('../utils/apiResponse');
const categoryService = require('../services/categoryService');

const listCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.listCategories();
  return apiSuccess(res, { data: categories });
});

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return apiSuccess(res, { statusCode: 201, message: 'Category created', data: category });
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return apiSuccess(res, { message: 'Category updated', data: category });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return apiSuccess(res, { message: 'Category deleted' });
});

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};


