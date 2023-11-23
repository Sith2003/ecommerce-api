const { orderServices } = require("../../services");

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderServices.getAllOrders();
    return res.status(200).json({
      total: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const getOrderById = async (req, res) => {
  try {
    // verifyAdminRole(req, res, async () => {
    const order = await orderServices.getOrderById(req);
    return res.status(200).json({
      message: "Query order",
      order,
    });
    // });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const searchData = async (req, res) => {
  try {
    const data = await orderServices.searchData(req);
    return res.status(200).json({
      total: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = {
  getOrderById,
  getAllOrders,
  searchData,
};
