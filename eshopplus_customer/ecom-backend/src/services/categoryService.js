const slugify = require('../utils/slugify');
const categoryRepository = require('../repositories/categoryRepository');

async function listCategories() {
  return categoryRepository.listCategories();
}

async function createCategory(payload) {
  return categoryRepository.createCategory({
    name: payload.name,
    slug: payload.slug || slugify(payload.name),
    iconUrl: payload.iconUrl,
    description: payload.description,
    parentId: payload.parentId,
    isActive: payload.isActive ?? true,
  });
}

async function updateCategory(id, payload) {
  if (payload.name && !payload.slug) {
    payload.slug = slugify(payload.name);
  }
  return categoryRepository.updateCategory(id, payload);
}

async function deleteCategory(id) {
  await categoryRepository.deleteCategory(id);
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};


