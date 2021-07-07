// Proxy API requests to a local API development instance when in development,
// removing the base /api from the path. This proxy runs in development only, see
// https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually

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
