const { loadMock } = require('./mockLoader');

function normalizePath(endpointPath) {
  if (!endpointPath) {
    throw new Error('Endpoint path is required');
  }
  return endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
}

function wrapHandler(pathOrName) {
  const mockKey = pathOrName.startsWith('/') ? pathOrName.slice(1) : pathOrName;
  return async (req, res, next) => {
    try {
      // Merge query params and body params
      const params = { ...req.query, ...req.body };
      const payload = await loadMock(mockKey, params, req.headers);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  };
}

function registerMockEndpoints(router, endpoints) {
  endpoints.forEach((endpointConfig) => {
    const { path, mockName, methods } = endpointConfig;
    const normalizedPath = normalizePath(path);
    const handler = wrapHandler(mockName || path);
    const verbs = Array.isArray(methods) && methods.length
      ? methods.map((method) => method.toLowerCase())
      : ['get', 'post'];

    verbs.forEach((method) => {
      if (method === 'all' && typeof router.all === 'function') {
        router.all(normalizedPath, handler);
        return;
      }

      if (typeof router[method] !== 'function') {
        throw new Error(`Unsupported HTTP method "${method}" for ${normalizedPath}`);
      }

      router[method](normalizedPath, handler);
    });
  });
}

module.exports = {
  registerMockEndpoints,
};

