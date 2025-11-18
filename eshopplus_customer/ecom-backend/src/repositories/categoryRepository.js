const { Category, Product } = require('../models');

async function listCategories() {
  return Category.findAll({
    where: { isActive: true },
    include: [{ model: Category, as: 'children' }],
    order: [['name', 'ASC']],
  });
}

async function createCategory(payload) {
  return Category.create(payload);
}

async function updateCategory(id, payload) {
  await Category.update(payload, { where: { id } });
  return Category.findByPk(id);
}

async function deleteCategory(id) {
  await Category.destroy({ where: { id } });
}

async function getCategoryWithProducts(id) {
  return Category.findByPk(id, {
    include: [{ model: Product, as: 'products' }],
  });
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryWithProducts,
};


