const { Op } = require('sequelize');
const {
  Product,
  ProductVariant,
  ProductImage,
  Category,
  Retailer,
  City,
} = require('../models');

async function createProduct(payload, { variants = [], images = [] } = {}) {
  const product = await Product.create(payload);
  if (variants.length) {
    await ProductVariant.bulkCreate(
      variants.map((variant) => ({
        ...variant,
        productId: product.id,
      })),
    );
  }
  if (images.length) {
    await ProductImage.bulkCreate(
      images.map((image) => ({
        ...image,
        productId: product.id,
      })),
    );
  }
  return findProductById(product.id);
}

async function updateProduct(id, payload) {
  await Product.update(payload, { where: { id } });
  return findProductById(id);
}

async function findProductById(id) {
  return Product.findByPk(id, {
    include: [
      { model: ProductVariant, as: 'variants' },
      { model: ProductImage, as: 'images' },
      { model: Category, as: 'category' },
      { model: Retailer, as: 'retailer' },
      { model: City, as: 'city' },
    ],
  });
}

async function listProductsByCity(cityId, { search, categoryId, retailerId } = {}, { limit, offset, sort } = {}) {
  return Product.findAndCountAll({
    where: {
      cityId,
      isPublished: true,
      ...(categoryId ? { categoryId } : {}),
      ...(retailerId ? { retailerId } : {}),
      ...(search
        ? {
            name: {
              [Op.like]: `%${search}%`,
            },
          }
        : {}),
    },
    include: [
      { model: Category, as: 'category' },
      { model: Retailer, as: 'retailer' },
      { model: ProductImage, as: 'images' },
      { model: ProductVariant, as: 'variants' },
    ],
    limit,
    offset,
    order: sort || [['createdAt', 'DESC']],
  });
}

async function addProductImages(productId, images) {
  await ProductImage.bulkCreate(
    images.map((imageUrl) => ({
      productId,
      imageUrl,
    })),
  );
  return findProductById(productId);
}

module.exports = {
  createProduct,
  updateProduct,
  findProductById,
  listProductsByCity,
  addProductImages,
};


