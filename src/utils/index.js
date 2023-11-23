const { redis } = require("./redis");
const { client } = require("./elasticsearch");
const { upload } = require("./upload");
const { logger, gatewayLogger } = require("./logger");

module.exports = {
  redis,
  client,
  upload,
  logger,
  gatewayLogger,
};
