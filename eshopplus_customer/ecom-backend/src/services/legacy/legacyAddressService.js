const ApiError = require('../../utils/apiError');
const addressService = require('../addressService');
const cityRepository = require('../../repositories/cityRepository');
const { formatAddress, buildMessageKey } = require('./legacyFormatter');

function mapLegacyAddressPayload(body, user) {
  return {
    userId: user.id,
    label: body.type || body.label || 'Home',
    contactName: body.name || `${user.firstName} ${user.lastName}`.trim(),
    phone: body.mobile || user.phone,
    line1: body.address || body.line1 || '',
    line2: body.landmark || body.line2 || '',
    landmark: body.landmark || '',
    pincode: body.pincode || body.zipcode || '',
    cityId: body.city_id || user.defaultCityId,
    areaId: body.area_id || null,
    latitude: body.latitude || null,
    longitude: body.longitude || null,
    isDefault: Number(body.is_default) === 1,
  };
}

async function listAddresses(req, res) {
  const addresses = await addressService.listAddresses(req.user.id);
  return res.json({
    error: false,
    message: 'Addresses fetched successfully',
    language_message_key: buildMessageKey('Addresses fetched successfully'),
    total: addresses.length.toString(),
    data: addresses.map(formatAddress),
  });
}

async function addAddress(req, res) {
  const payload = mapLegacyAddressPayload(req.body, req.user);
  if (!payload.line1) {
    throw new ApiError(400, 'Address is required');
  }
  if (!payload.cityId) {
    throw new ApiError(400, 'City is required');
  }
  await cityRepository.findCityById(payload.cityId);
  const address = await addressService.createAddress(payload);
  return res.status(201).json({
    error: false,
    message: 'Address saved successfully',
    language_message_key: buildMessageKey('Address saved successfully'),
    data: [formatAddress(address)],
  });
}

async function updateAddress(req, res) {
  const { id } = req.body;
  if (!id) {
    throw new ApiError(400, 'Address id is required');
  }
  const payload = mapLegacyAddressPayload(req.body, req.user);
  const updated = await addressService.updateAddress(req.user.id, id, payload);
  return res.json({
    error: false,
    message: 'Address updated successfully',
    language_message_key: buildMessageKey('Address updated successfully'),
    data: [formatAddress(updated)],
  });
}

async function deleteAddress(req, res) {
  const { id } = req.body;
  if (!id) {
    throw new ApiError(400, 'Address id is required');
  }
  await addressService.deleteAddress(req.user.id, id);
  return res.json({
    error: false,
    message: 'Address deleted successfully',
    language_message_key: buildMessageKey('Address deleted successfully'),
  });
}

module.exports = {
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};


