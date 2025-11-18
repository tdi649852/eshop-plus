const fs = require('fs/promises');
const path = require('path');
const logger = require('../src/utils/logger');
const { resolveLegacyCity, buildLegacyPlaceholder } = require('../src/utils/legacyCompat');

const dynamicCityEndpoints = new Set([
  'get_categories',
  'get_categories_sliders',
  'get_offer_images',
  'get_slider_images',
  'get_offers_sliders',
  'get_brands',
  'get_sections',
  'get_sellers',
  'best_sellers',
  'top_sellers',
  'most_selling_products',
  'get_products',
  'get_combo_products',
]);

function normalizeStoreIdValue(requestedStoreId, originalValue) {
  if (requestedStoreId === undefined || requestedStoreId === null) {
    return originalValue;
  }

  const rawValue = Array.isArray(requestedStoreId)
    ? requestedStoreId[0]
    : requestedStoreId;

  if (typeof originalValue === 'number') {
    const parsed = Number(rawValue);
    return Number.isNaN(parsed) ? originalValue : parsed;
  }

  return rawValue.toString();
}

function replaceStoreId(data, requestedStoreId) {
  if (requestedStoreId === undefined || requestedStoreId === null) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => replaceStoreId(item, requestedStoreId));
  } else if (data && typeof data === 'object') {
    const newData = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'store_id') {
        newData[key] = normalizeStoreIdValue(requestedStoreId, value);
      } else {
        newData[key] = replaceStoreId(value, requestedStoreId);
      }
    }
    return newData;
  }
  return data;
}

function buildPlaceholderUrl(city, width, height, label) {
  const textLabel = `${city?.name ?? ''} ${label}`.trim();
  return buildLegacyPlaceholder(city, width, height, textLabel);
}

function transformCategory(category, city, labelSuffix = '') {
  if (!category || typeof category !== 'object') return category;
  category.store_id = city.storeId;
  const baseName = category.name || 'Category';
  category.name = `${city.name} ${baseName}`.trim();
  category.image = buildPlaceholderUrl(city, 360, 240, `Category ${labelSuffix || baseName}`);
  category.banner = buildPlaceholderUrl(city, 640, 260, `Banner ${labelSuffix || baseName}`);
  if (Array.isArray(category.children)) {
    category.children = category.children.map((child, index) =>
      transformCategory(child, city, `${labelSuffix || ''}${index + 1}`),
    );
  }
  return category;
}

function transformCategories(categories, city) {
  if (!Array.isArray(categories)) return categories;
  return categories.map((category, index) =>
    transformCategory(category, city, `${index + 1}`),
  );
}

function transformSliderImages(list, city, labelPrefix) {
  if (!Array.isArray(list)) return list;
  return list.map((item, index) => {
    if (item && typeof item === 'object') {
      item.store_id = city.storeId;
      item.title = `${city.name} ${item.title ?? labelPrefix}`.trim();
      item.image = buildPlaceholderUrl(city, 800, 340, `${labelPrefix} ${index + 1}`);
      if (item.banner_image) {
        item.banner_image = buildPlaceholderUrl(
          city,
          1000,
          380,
          `${labelPrefix} Banner ${index + 1}`,
        );
      }
      if (item.background_color) {
        item.background_color = `#${city.bg}`;
      }
      if (Array.isArray(item.category_data)) {
        item.category_data = transformCategories(item.category_data, city);
      }
    }
    return item;
  });
}

function transformBrands(brands, city) {
  if (!Array.isArray(brands)) return brands;
  return brands.map((brand, index) => {
    if (brand && typeof brand === 'object') {
      brand.store_id = city.storeId;
      const baseName = brand.name || 'Brand';
      brand.name = `${city.name} ${baseName}`.trim();
      brand.image = buildPlaceholderUrl(city, 240, 240, `Brand ${index + 1}`);
    }
    return brand;
  });
}

function transformProduct(product, city, index) {
  if (!product || typeof product !== 'object') return product;
  product.store_id = city.storeId;
  const baseName = product.name || 'Product';
  product.name = `${city.name} ${baseName}`.trim();
  product.image = buildPlaceholderUrl(city, 600, 600, `Product ${index}`);
  if (Array.isArray(product.other_images)) {
    product.other_images = product.other_images.map((_, imgIndex) =>
      buildPlaceholderUrl(city, 600, 600, `Product ${index} Alt ${imgIndex + 1}`),
    );
  }
  if (Array.isArray(product.variants)) {
    product.variants = product.variants.map((variant) => ({
      ...variant,
      product_image: product.image,
    }));
  }
  if (product.seller_name) {
    product.seller_name = `${city.name} ${product.seller_name}`.trim();
  }
  if (product.store_name) {
    product.store_name = `${city.name} ${product.store_name}`.trim();
  }
  if (product.brand_name) {
    product.brand_name = `${city.name} ${product.brand_name}`.trim();
  }
  if (product.category_name) {
    product.category_name = `${city.name} ${product.category_name}`.trim();
  }
  if (Array.isArray(product.product_details)) {
    product.product_details = product.product_details.map((detail, idx) =>
      transformProduct(detail, city, `${index}.${idx + 1}`),
    );
  }
  return product;
}

function transformProducts(list, city) {
  if (!Array.isArray(list)) return list;
  return list.map((product, index) => transformProduct(product, city, index + 1));
}

function transformSections(sections, city) {
  if (!Array.isArray(sections)) return sections;
  return sections.map((section, index) => {
    if (section && typeof section === 'object') {
      section.store_id = city.storeId;
      section.title = `${city.name} ${section.title ?? 'Collection'}`.trim();
      section.banner_image = buildPlaceholderUrl(
        city,
        1024,
        360,
        `Section ${index + 1}`,
      );
      if (Array.isArray(section.product_details)) {
        section.product_details = section.product_details.map((product, idx) =>
          transformProduct(product, city, `${index + 1}.${idx + 1}`),
        );
      }
    }
    return section;
  });
}

function transformSellers(list, city) {
  if (!Array.isArray(list)) return list;
  return list.map((seller, index) => {
    if (seller && typeof seller === 'object') {
      seller.store_id = city.storeId;
      seller.store_name = `${city.name} ${seller.store_name ?? 'Seller'}`.trim();
      seller.seller_name = `${city.name} ${seller.seller_name ?? 'Vendor'}`.trim();
      seller.store_logo = buildPlaceholderUrl(
        city,
        220,
        220,
        `Seller ${index + 1}`,
      );
    }
    return seller;
  });
}

function transformMostSellingProducts(list, city) {
  if (!Array.isArray(list)) return list;
  return list.map((product, index) => {
    if (product && typeof product === 'object') {
      product.store_id = city.storeId;
      product.product_name = `${city.name} ${product.product_name ?? 'Top Pick'}`.trim();
      product.image = buildPlaceholderUrl(city, 560, 560, `Top ${index + 1}`);
    }
    return product;
  });
}

function applyCityOverrides(endpoint, payload, city) {
  switch (endpoint) {
    case 'get_categories':
      payload.data = transformCategories(payload.data, city);
      payload.total = Array.isArray(payload.data) ? payload.data.length : 0;
      break;
    case 'get_categories_sliders':
      payload.slider_images = transformSliderImages(payload.slider_images, city, 'Category');
      break;
    case 'get_offer_images':
      payload.data = transformSliderImages(payload.data, city, 'Offer');
      break;
    case 'get_slider_images':
      payload.data = transformSliderImages(payload.data, city, 'Slider');
      break;
    case 'get_offers_sliders':
      payload.data = transformSliderImages(payload.data, city, 'Deal');
      break;
    case 'get_brands':
      payload.data = transformBrands(payload.data, city);
      payload.total = Array.isArray(payload.data) ? payload.data.length : 0;
      break;
    case 'get_sections':
      payload.data = transformSections(payload.data, city);
      break;
    case 'get_sellers':
    case 'best_sellers':
    case 'top_sellers':
      payload.data = transformSellers(payload.data, city);
      break;
    case 'most_selling_products':
      payload.data = transformMostSellingProducts(payload.data, city);
      break;
    case 'get_products':
    case 'get_combo_products':
      payload.data = transformProducts(payload.data, city);
      break;
    default:
      break;
  }
  return payload;
}

function resolveMockFilePath(endpoint) {
  const sanitized = endpoint.replace(/[^a-z0-9/_-]/gi, '').replace(/\/+/g, '_');
  return path.join(process.cwd(), 'mockData', `${sanitized}.json`);
}

async function loadMock(endpoint, queryParams = {}, headers = {}) {
  try {
    const filePath = resolveMockFilePath(endpoint);
    const fileContents = await fs.readFile(filePath, 'utf8');
    let data = JSON.parse(fileContents);

    const cityConfig = resolveLegacyCity(queryParams, headers);
    const requestedStoreId = queryParams.store_id ?? cityConfig?.storeId;

    if (requestedStoreId) {
      data = replaceStoreId(data, requestedStoreId);
    }

    if (cityConfig && dynamicCityEndpoints.has(endpoint)) {
      data = applyCityOverrides(endpoint, data, cityConfig);
    }

    return data;
  } catch (error) {
    logger.warn('Failed to load mock for %s: %s', endpoint, error.message);
    return { error: true, message: `Mock data not found for ${endpoint}` };
  }
}

module.exports = {
  loadMock,
};
