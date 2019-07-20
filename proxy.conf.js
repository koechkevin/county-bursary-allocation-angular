const PROXY_CONFIG = {
  "/api/*": {
    "target": "http://localhost:5000",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {},
    "changeOrigin": true,
    "bypass": function (req, res, proxyOptions) {
      req.headers["origin"] = 'http://localhost:5000';
    },
  }
};

module.exports = PROXY_CONFIG;
