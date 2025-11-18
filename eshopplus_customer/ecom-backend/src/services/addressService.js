const addressRepository = require('../repositories/addressRepository');
const ApiError = require('../utils/apiError');

async function listAddresses(userId) {
  return addressRepository.listUserAddresses(userId);
}

async function createAddress(userId, payload) {
  return addressRepository.createAddress({
    ...payload,
    userId,
  });
}

async function updateAddress(userId, addressId, payload) {
  const address = await addressRepository.updateAddress(addressId, payload);
  if (!address || address.userId !== userId) {
    throw new ApiError(404, 'Address not found');
  }
  return address;
}

async function deleteAddress(userId, addressId) {
  const deleted = await addressRepository.deleteAddress(addressId, userId);
  if (!deleted) {
    throw new ApiError(404, 'Address not found');
  }
}

module.exports = {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};


