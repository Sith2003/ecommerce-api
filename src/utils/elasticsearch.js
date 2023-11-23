const { Client } = require("@elastic/elasticsearch")
const config = require('../config')

const client = new Client({ node: config.ELASTICSEARCH_NODE })

module.exports = { client }