// When in development proxy API requests to a local API development instance, removing the base /api from the path
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4567',
      changeOrigin: true,
      pathRewrite: {
        '^/api/': '/', // remove base path
      },
    })
  );
};
