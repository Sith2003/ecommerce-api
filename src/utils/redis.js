const Redis = require("ioredis");

const options = {};

const redis = new Redis(options);

module.exports = { redis };
