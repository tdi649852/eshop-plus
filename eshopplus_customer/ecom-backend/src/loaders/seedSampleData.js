const { City, Retailer, Category, Product, ProductVariant, ProductImage, User } = require('../models');
const { RETAILER_STATUS, USER_ROLES } = require('../utils/constants');
const { hashPassword } = require('../utils/password');
const slugify = require('../utils/slugify');
const logger = require('../utils/logger');

const SAMPLE_RETAILERS = [
  {
    name: 'Metro Fresh Mart',
    description: 'Daily essentials, groceries, and more from your neighbourhood marketplace.',
    pincode: '110001',
  },
  {
    name: 'Urban Fashion House',
    description: 'Trendy apparel and accessories curated for modern shoppers.',
    pincode: '201301',
  },
  {
    name: 'Tech Hub Electronics',
    description: 'Gadgets, accessories, and devices from verified local sellers.',
    pincode: '400001',
  },
];

const SAMPLE_CATEGORIES = [
  { name: 'Groceries', slug: 'groceries' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Electronics', slug: 'electronics' },
];

async function ensureCustomer() {
  const existing = await User.findOne({ where: { email: 'customer@eshopplus.local' } });
  if (existing) {
    return;
  }
  const password = await hashPassword('123456');
  await User.create({
    firstName: 'Demo',
    lastName: 'Customer',
    email: 'customer@eshopplus.local',
    phone: '9898765432',
    password,
    role: USER_ROLES.CUSTOMER,
    isEmailVerified: true,
  });
  logger.info('Seeded default customer (customer@eshopplus.local / 123456)');
}

async function ensureCategories() {
  const categories = [];
  for (const category of SAMPLE_CATEGORIES) {
    // eslint-disable-next-line no-await-in-loop
    const [record] = await Category.findOrCreate({
      where: { slug: category.slug },
      defaults: {
        name: category.name,
        description: `${category.name} products`,
        isActive: true,
      },
    });
    categories.push(record);
  }
  return categories;
}

async function ensureRetailerUser(city) {
  const email = `retailer-${city.id}@eshopplus.local`;
  let user = await User.findOne({ where: { email } });
  if (!user) {
    const password = await hashPassword('123456');
    user = await User.create({
      firstName: city.name,
      lastName: 'Seller',
      email,
      phone: `98${city.id}000000`,
      password,
      role: USER_ROLES.RETAILER,
      defaultCityId: city.id,
      isEmailVerified: true,
    });
  }
  return user;
}

async function ensureRetailerForCity(city, categories) {
  const existing = await Retailer.findOne({ where: { cityId: city.id } });
  if (existing) {
    return existing;
  }
  const owner = await ensureRetailerUser(city);
  const sample = SAMPLE_RETAILERS[city.id % SAMPLE_RETAILERS.length];
  const retailer = await Retailer.create({
    userId: owner.id,
    storeName: `${city.name} ${sample.name}`,
    slug: `${slugify(city.name)}-${slugify(sample.name)}-${Date.now()}`,
    phone: '9999999999',
    gstNumber: '29ABCDE1234F2Z5',
    addressLine1: `${city.name} Central Market`,
    pincode: sample.pincode,
    cityId: city.id,
    status: RETAILER_STATUS.APPROVED,
    description: sample.description,
    deliveryRadiusKm: 15,
  });

  for (const category of categories) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.create({
      retailerId: retailer.id,
      categoryId: category.id,
      cityId: city.id,
      name: `${city.name} ${category.name} Product`,
      slug: `${slugify(city.name)}-${slugify(category.name)}-${Date.now()}`,
      sku: `${city.id}${category.id}${Date.now()}`,
      description: `Quality ${category.name.toLowerCase()} sourced locally in ${city.name}.`,
      unit: 'pcs',
      basePrice: 199,
      salePrice: 149,
      stock: 50,
      isPublished: true,
      isFeatured: true,
    });

    // eslint-disable-next-line no-await-in-loop
    await ProductVariant.create({
      productId: product.id,
      label: 'Standard Pack',
      price: 199,
      salePrice: 149,
      stock: 50,
      unit: 'pcs',
    });

    // eslint-disable-next-line no-await-in-loop
    await ProductImage.create({
      productId: product.id,
      imageUrl: `https://placehold.co/600x600?text=${encodeURIComponent(city.name)}`,
      isPrimary: true,
    });
  }

  return retailer;
}

async function seedSampleData() {
  await ensureCustomer();
  const categories = await ensureCategories();
  const cities = await City.findAll({ where: { isActive: true } });
  for (const city of cities) {
    // eslint-disable-next-line no-await-in-loop
    await ensureRetailerForCity(city, categories);
  }
}

module.exports = seedSampleData;


