function toLegacyNumericId(value, fallback = 0) {
  if (!value) {
    return fallback;
  }
  if (typeof value === 'number') {
    return value;
  }
  const numeric = Number(value);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }
  let hash = 0;
  const str = String(value);
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

module.exports = {
  toLegacyNumericId,
};


