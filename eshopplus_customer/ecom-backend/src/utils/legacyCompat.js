const LEGACY_CITY_CONFIGS = {
  '501': { id: '501', name: 'Delhi', code: 'delhi', storeId: 501, bg: 'F44336', text: 'FFFFFF' },
  '502': { id: '502', name: 'Noida', code: 'noida', storeId: 502, bg: '03A9F4', text: 'FFFFFF' },
  '503': { id: '503', name: 'Gurugram', code: 'gurugram', storeId: 503, bg: '009688', text: 'FFFFFF' },
  '504': { id: '504', name: 'Varanasi', code: 'varanasi', storeId: 504, bg: '8E24AA', text: 'FFFFFF' },
  '505': { id: '505', name: 'Patna', code: 'patna', storeId: 505, bg: 'FF7043', text: 'FFFFFF' },
  '506': { id: '506', name: 'Mumbai', code: 'mumbai', storeId: 506, bg: 'FFB300', text: '1C1C1C' },
};

function normalizeCandidate(value) {
  if (value === undefined || value === null) return null;
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw === 'number') {
    return raw.toString();
  }
  return raw.toString().trim();
}

function findCityConfig(value) {
  if (!value) return null;
  const byId = LEGACY_CITY_CONFIGS[value];
  if (byId) return byId;
  const lowered = value.toLowerCase();
  return (
    Object.values(LEGACY_CITY_CONFIGS).find(
      (config) => config.code === lowered || config.name.toLowerCase() === lowered,
    ) || null
  );
}

function resolveLegacyCity(params = {}, headers = {}) {
  const candidate =
    normalizeCandidate(params.store_id) ??
    normalizeCandidate(params.storeId) ??
    normalizeCandidate(params.city_id) ??
    normalizeCandidate(params.cityId) ??
    normalizeCandidate(params.city_code) ??
    normalizeCandidate(params.city) ??
    normalizeCandidate(headers['x-city-id']) ??
    normalizeCandidate(headers['x-city-code']) ??
    normalizeCandidate(headers['x-city-name']);

  return findCityConfig(candidate);
}

function buildLegacyPlaceholder(city, width, height, label) {
  const fallbackBg = '2663FF';
  const fallbackText = 'FFFFFF';
  const bg = city?.bg ?? fallbackBg;
  const text = city?.text ?? fallbackText;
  const safeLabel = encodeURIComponent(label || city?.name || 'Retailer').replace(/%20/g, '+');
  return `https://placehold.co/${width}x${height}/${bg}/${text}?text=${safeLabel}`;
}

module.exports = {
  LEGACY_CITY_CONFIGS,
  resolveLegacyCity,
  buildLegacyPlaceholder,
};


