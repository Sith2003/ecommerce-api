const express = require('express');
const router = express.Router();

const routeModules = [
  require('./auth.routes'),
  require('./product.routes'),
  require('./user.routes'),
  require('./order.routes'),
  require('./payment.routes'),
  require('./search.routes'),
  require('./address.routes'),
];

routeModules.forEach((routeModule) => routeModule(router));

module.exports = router;
