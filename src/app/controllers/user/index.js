const { userServices } = require("../../services");

const getAllUsers = async (req, res) => {
  try {
    const users = await userServices.getAllUsers();
    return res.status(200).json({
      total: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userServices.getUserById(req);
    return res.status(200).json({
      message: "Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userServices.updateUser(req);
    return res.status(200).json({
      message: "User has been updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userServices.deleteUser(req);
    return res.status(200).json({
      message: "User has been deleted",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
