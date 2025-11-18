const dayjs = require('dayjs');
const { toLegacyNumericId } = require('../../utils/legacyId');

function buildMessageKey(message) {
  if (!message) return '';
  return message
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function formatUser(user) {
  if (!user) return null;
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;
  const nowEpoch = dayjs().unix();
  return {
    id: toLegacyNumericId(user.id),
    role_id: user.role === 'admin' ? 1 : user.role === 'retailer' ? 3 : 2,
    ip_address: '127.0.0.1',
    username: fullName,
    email: user.email,
    mobile: user.phone,
    country_code: '+91',
    image: user.avatarUrl || 'https://placehold.co/128x128?text=User',
    balance: Number(user.walletBalance || 0),
    activation_selector: null,
    activation_code: null,
    forgotten_password_selector: null,
    forgotten_password_code: null,
    forgotten_password_time: null,
    remember_selector: null,
    remember_code: null,
    created_on: nowEpoch,
    last_login: nowEpoch,
    active: user.status === 'inactive' ? 0 : 1,
    company: null,
    address: null,
    bonus: 0,
    cash_received: 0,
    dob: null,
    city: null,
    area: null,
    street: null,
    pincode: null,
    apikey: null,
    referral_code: user.referralCode || '',
    friends_code: user.friendsCode || '',
    fcm_id: [],
    latitude: null,
    longitude: null,
    created_at: user.createdAt ? dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
    type: 'phone',
    is_notification_on: user.isNotificationOn ? 1 : 1,
  };
}

function formatAddress(address) {
  if (!address) return null;
  return {
    id: address.id,
    user_id: toLegacyNumericId(address.userId),
    name: address.contactName,
    mobile: address.phone,
    address: address.line1,
    city: address.city?.name,
    city_id: address.cityId,
    area: address.area?.name || '',
    pincode: address.pincode,
    state: address.city?.state || '',
    country: address.city?.country || 'India',
    is_default: address.isDefault ? 1 : 0,
    latitude: address.latitude ? address.latitude.toString() : null,
    longitude: address.longitude ? address.longitude.toString() : null,
    created_at: address.createdAt ? dayjs(address.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
  };
}

function formatProductSummary(product, variant, retailer) {
  if (!product) return null;
  const baseImage =
    product.images?.[0]?.imageUrl || 'https://placehold.co/600x600?text=Product';
  return {
    id: toLegacyNumericId(product.id),
    name: product.name,
    slug: product.slug,
    image: baseImage,
    short_description: product.description?.slice(0, 160) || '',
    description: product.description || '',
    price: Number(product.basePrice),
    special_price: product.salePrice ? Number(product.salePrice) : 0,
    minimum_order_quantity: product.minOrderQuantity || 1,
    quantity_step_size: 1,
    total_allowed_quantity: product.maxOrderQuantity || 0,
    is_prices_inclusive_tax: 1,
    indicator: '0',
    type: 'simple_product',
    availability: product.stock > 0 ? 1 : 0,
    pickup_location: retailer?.storeName || 'Warehouse',
    tax_percentage: '0',
    product_details: null,
  };
}

function formatCartItem(cartItem) {
  const product = cartItem.product;
  const retailer = product?.retailer;
  const variant = cartItem.variant;
  return {
    id: toLegacyNumericId(cartItem.id),
    user_id: toLegacyNumericId(cartItem.cart?.userId || cartItem.cartId || 0),
    product_id: product ? toLegacyNumericId(product.id) : null,
    product_variant_id: variant ? toLegacyNumericId(variant.id) : null,
    qty: cartItem.quantity,
    is_saved_for_later: 0,
    product_name: product?.name,
    product_image:
      product?.images?.[0]?.imageUrl || 'https://placehold.co/600x600?text=Product',
    variant_price: variant ? Number(variant.price) : Number(cartItem.priceSnapshot),
    special_price: variant && variant.salePrice ? Number(variant.salePrice) : 0,
    tax_percentage: '0',
    stock: variant ? variant.stock : product?.stock || 0,
    seller_id: retailer ? toLegacyNumericId(retailer.id) : null,
    seller_name: retailer?.storeName,
    product_details: [formatProductSummary(product, variant, retailer)],
  };
}

function summarizeCart(cart) {
  const items = cart?.items || [];
  const subTotal = items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
  return {
    total_quantity: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0).toString(),
    sub_total: subTotal.toFixed(2),
    item_total: subTotal.toFixed(2),
    discount: '0.00',
    coupon_discount: '0.00',
    delivery_charge: (cart?.deliveryFee || 0).toFixed(2),
    tax_percentage: '0',
    tax_amount: '0.00',
    overall_amount: (subTotal + Number(cart?.deliveryFee || 0)).toFixed(2),
    cart: items.map(formatCartItem),
  };
}

function formatOrder(order) {
  return {
    id: order.id,
    status: order.status,
    payment_status: order.paymentStatus,
    payment_method: order.paymentMethod,
    subtotal: Number(order.subtotal).toFixed(2),
    discount: Number(order.discount).toFixed(2),
    delivery_charge: Number(order.deliveryFee).toFixed(2),
    total: Number(order.total).toFixed(2),
    created_at: dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    items: order.items?.map((item) => ({
      product_id: toLegacyNumericId(item.productId),
      product_name: item.product?.name,
      qty: item.quantity,
      price: Number(item.price).toFixed(2),
      retailer_id: toLegacyNumericId(item.retailerId),
    })),
  };
}

function formatWishlistItem(item) {
  const product = item.product;
  return {
    id: toLegacyNumericId(item.id),
    user_id: toLegacyNumericId(item.userId),
    product_id: product ? toLegacyNumericId(product.id) : null,
    product_name: product?.name,
    product_image:
      product?.images?.[0]?.imageUrl || 'https://placehold.co/600x600?text=Product',
    price: product ? Number(product.basePrice).toFixed(2) : '0.00',
    special_price: product && product.salePrice ? Number(product.salePrice).toFixed(2) : '0.00',
    rating: '0.0',
    stock: product?.stock || 0,
    seller_id: product?.retailer ? toLegacyNumericId(product.retailer.id) : null,
    seller_name: product?.retailer?.storeName,
    created_at: item.createdAt ? dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
  };
}

module.exports = {
  formatUser,
  formatAddress,
  formatCartItem,
  summarizeCart,
  formatOrder,
  formatWishlistItem,
  buildMessageKey,
};


