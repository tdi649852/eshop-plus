const USER_ROLES = {
  ADMIN: 'admin',
  RETAILER: 'retailer',
  CUSTOMER: 'customer',
};

const RETAILER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PACKED: 'packed',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

module.exports = {
  USER_ROLES,
  RETAILER_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
};


