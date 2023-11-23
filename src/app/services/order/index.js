const { Order } = require("../../models");
const { redis } = require("../../../utils");
const config = require("../../../config");

const getCachedOrders = async () => {
  try {
    const redisOrder = await redis.get("orders");
    if (redisOrder) {
      return JSON.parse(redisOrder);
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllOrders = async () => {
  try {
    const cachedOrders = await getCachedOrders();
    if (cachedOrders) {
      return cachedOrders;
    }

    const orders = await Order.find();
    // .populate("users")
    // .populate("products")
    // .exec()
    await redis.set(
      "orders",
      JSON.stringify(orders),
      "EX",
      config.cache.CACHE_EXPIRE_TIME
    );
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderById = async (req) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOne({ orderId: orderId });
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchData = async (req) => {
  try {
    const { from, to } = req.body;
    const startDate = new Date(from);
    const endDate = new Date(to);
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          // ... other conditions based on your requirements
        },
      },
    ];
    const data = await Order.aggregate(pipeline).exec();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  searchData,
};
