const { Product, User, Order } = require("../../models");
const { client, redis } = require("../../../utils");
const config = require("../../../config");

const getCachedProducts = async () => {
  try {
    const redisProduct = await redis.get("products");
    if (redisProduct) {
      return JSON.parse(redisProduct);
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProducts = async () => {
  try {
    const cachedProducts = await getCachedProducts();
    if (cachedProducts) {
      return cachedProducts;
    }
    const products = await Product.find()
      .populate("users")
      .populate("orders")
      .exec();
    await redis.set(
      "products",
      JSON.stringify(products),
      "EX",
      config.cache.CACHE_EXPIRE_TIME
    );
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

const productPagination = async (req) => {
  try {
    const responsePerPage = 10;
    const currentPage = Number(req.query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);
    const keyword = req.query.keyword
      ? {
          $or: [
            { productName: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const cachedProducts = await getCachedProducts();
    let products;

    if (cachedProducts) {
      products = cachedProducts.slice(skip, skip + responsePerPage);
    } else {
      products = await Product.find({ ...keyword })
        .populate("users")
        .populate("orders")
        .limit(responsePerPage)
        .skip(skip)
        .exec();

      await redis.set(
        "products",
        JSON.stringify(products),
        "EX",
        config.cache.CACHE_EXPIRE_TIME
      );
    }

    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createProduct = async (req) => {
  try {
    const productData = {
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      image: req.body.image,
      coverImage: req.body.coverImage,
    };
    const product = await Product.create(productData);
    await client.index({
      index: "products",
      body: productData,
    });
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const purchaseProduct = async (userId, productId) => {
  try {
    const product = await Product.findById(productId)
      .populate("users")
      .populate("orders");
    if (!product) {
      throw new Error("Product not found");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const order = await Order.create({
      name: product.productName,
      user: userId,
      product: productId,
      amount: 1,
      price: product.price,
      status: "PENDING",
    });
    await order.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { products: productId } },
      { new: true }
    );

    if (product.quantity <= 0) {
      throw new Error("Product out of stock");
    }
    product.quantity -= 1;

    await Product.findByIdAndUpdate(
      productId,
      { $push: { orders: order._id, users: user.id } },
      { new: true }
    );
    await product.save();

    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProductById = async (req) => {
  try {
    const productId = req.params.id;
    const productData = {
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      image: req.body.image,
      coverImage: req.body.coverImage,
    };
    if (!productId) {
      throw new Error("Product ID is required for updating");
    }
    if (!productData) {
      throw new Error("Product data is required for updating");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      { new: true }
    );
    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    return updatedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateManyProductPrice = async (req) => {
  try {
    const price = req.body.price;
    const productName = req.body.productName;
    const product = await Product.updateMany(
      { productName: productName },
      { $set: { price: price } }
    );
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (req) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getProducts,
  productPagination,
  createProduct,
  purchaseProduct,
  updateProductById,
  updateManyProductPrice,
  deleteProduct,
};
