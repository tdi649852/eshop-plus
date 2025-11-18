const crypto = require('crypto');

/**
 * Generate unique retailer ID in format: MR20246AZJL
 */
function generateRetailerUniqueId() {
  const year = new Date().getFullYear();
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase().substring(0, 6);
  return `MR${year}${randomStr}`;
}

/**
 * Generate order number in format: #1627
 */
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 10);
  return `#${timestamp}${random}`;
}

/**
 * Generate support ticket number in format: TKT-20240001
 */
function generateTicketNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TKT-${year}${random}`;
}

/**
 * Calculate discount price based on priority: Product > Category > Store-wide
 */
function calculateDiscountedPrice(basePrice, productDiscount, categoryDiscount, storeDiscount) {
  if (productDiscount && productDiscount.isActive) {
    if (productDiscount.discountType === 'percentage') {
      return basePrice * (1 - productDiscount.value / 100);
    }
    return productDiscount.value; // fixed price
  }

  if (categoryDiscount && categoryDiscount.isActive) {
    return basePrice * (1 - categoryDiscount.value / 100);
  }

  if (storeDiscount && storeDiscount > 0) {
    return basePrice * (1 - storeDiscount / 100);
  }

  return basePrice;
}

/**
 * Calculate commission amount
 */
function calculateCommission(total, percentage = 5) {
  return (total * percentage) / 100;
}

/**
 * Generate slug from text
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Paginate query results
 */
function getPaginationParams(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return { limit: parseInt(limit), offset };
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = {
  generateRetailerUniqueId,
  generateOrderNumber,
  generateTicketNumber,
  calculateDiscountedPrice,
  calculateCommission,
  slugify,
  getPaginationParams,
  calculateDistance,
};
