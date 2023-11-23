const { User } = require("../../models");
const config = require("../../../config");
const { redis } = require("../../../utils");

const getCachedUsers = async () => {
  try {
    const redisUsers = await redis.get("users");
    if (redisUsers) {
      return JSON.parse(redisUsers);
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllUsers = async () => {
  try {
    const cachedUsers = await getCachedUsers();
    if (cachedUsers) {
      return cachedUsers;
    }

    const users = await User.find().populate("products");
    await redis.set(
      "users",
      JSON.stringify(users),
      "EX",
      config.cache.CACHE_EXPIRE_TIME
    );
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserById = async (req) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("products");
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUser = async (req) => {
  try {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    const image = req.file;
    const userData = {
      username,
      email,
      image: image.filename,
      password,
    };
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    }).populate("products");
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUser = async (req) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
