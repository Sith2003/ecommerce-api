const { productServices } = require("../../services");

const getAllProducts = async (req, res) => {
  try {
    // if (!req.session.userRole || (req.session.userRole != config.role.ADMIN_ROLE)) throw config.statusMessage.PERMISSION_DENIED;
    // console.log(req.session)
    const products = await productServices.getProducts();
    return res.json({
      total: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const productPagination = async (req, res) => {
  try {
    const products = await productServices.productPagination(req);
    return res.json({
      total: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

const createProducts = async (req, res) => {
  try {
    const product = productServices.createProduct(req);
    return res.status(200).json({
      message: "Product has been created",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const buyProduct = async (req, res) => {
  try {
    const userId = verifyToken.data.userId;
    const productId = req.params.id;
    const product = await productServices.purchaseProduct(userId, productId);
    return res.status(200).json({
      message: "Product has been bought",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productServices.updateProductById(req);
    return res.status(200).json({
      message: "Product has been updated",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const updateManyProductPrice = async (req, res) => {
  try {
    const product = await productServices.updateManyProductPrice(req);
    return res.status(200).json({
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productServices.deleteProduct(req);
    return res.status(200).json({
      message: "Product has been deleted",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = {
  getAllProducts,
  createProducts,
  buyProduct,
  updateProduct,
  updateManyProductPrice,
  deleteProduct,
  productPagination,
};
