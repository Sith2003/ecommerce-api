const client = require("../../../utils/elasticsearch");

const searchUserByname = async (req, res) => {
  const { q } = req.query;
  if (!q)
    return res.status(400).json({ error: "Query parameter q is required." });
  try {
    const result = await client.search({
      index: "users",
      body: {
        query: {
          match: {
            username: q,
          },
        },
      },
    });
    const data = result.hits.hits;
    res.json({
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Elasticsearch error:", error);
    res.status(500).json({ message: error.message });
  }
};

const searchProductByname = async (req, res) => {
  const { q } = req.query;
  if (!q)
    return res.status(400).json({ error: "Query parameter q is required." });
  try {
    const result = await client.search({
      index: "products",
      body: {
        query: {
          match: {
            productName: q,
          },
        },
      },
    });
    const data = result.hits.hits;
    res.json({
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Elasticsearch error:", error);
    res.status(500).json({ message: error.message });
  }
};

const insertData = async (req, res) => {
  const data = req.body;
  const { index } = req.query;
  if (!data) {
    return res.status(400).json({ error: "Data payload is required." });
  }
  try {
    const result = await client.index({
      index,
      body: data,
    });
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = {
  searchUserByname,
  searchProductByname,
  insertData,
};
