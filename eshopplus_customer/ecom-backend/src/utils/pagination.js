function getPaginationParams(req) {
  const limit = Math.min(Number(req.query.limit) || 15, 100);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const offset = (page - 1) * limit;
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';

  return {
    limit,
    offset,
    page,
    sort: [[sortBy, sortOrder]],
  };
}

function buildMeta({ total = 0, page = 1, limit = 15 }) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

module.exports = {
  getPaginationParams,
  buildMeta,
};


