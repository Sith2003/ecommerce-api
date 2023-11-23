const jwt = require("jsonwebtoken");
const config = require("../config");

const generateAccessToken = async (user) => {
  try {
    const token = jwt.sign({ userId: user._id, role: user.role }, config.JWT, {
      expiresIn: config.token.TOKEN_EXPIRE_TIME,
    });
    return token;
  } catch (err) {
    console.log("err: ", err);
  }
};

const getUserDataOnToken = (req) => {
  try {
    const authorization = req.headers.authorization;
    if (authorization) token = authorization.split(" ")[1];
    const { userId, role } = jwt.verify(token, config.JWT);
    return { userId, role };
  } catch (error) {
    console.log(error);
  }
};
const getUserDataOnCookies = (req) => {
  try {
    const authorization = req.cookies.accessToken;
    const { userId, role } = jwt.verify(authorization, config.JWT);
    return { userId, role };
  } catch (error) {
    console.log(error);
  }
};
const tokenVerification = async (req) => {
  try {
    const tokenFromHeader = getUserDataOnToken(req);
    // const tokenFromHeader = getUserDataOnCookies(req)
    if (!tokenFromHeader) return { isValid: false, data: null };
    return { isValid: true, data: tokenFromHeader };
  } catch (error) {
    console.log(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const verifyToken = await tokenVerification(req);
    if (
      !verifyToken.isValid ||
      verifyToken.data.role !== config.role.ADMIN_ROLE
    ) {
      return res.status(403).json({
        status: false,
        message: config.statusMessage.PERMISSION_DENIED,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

const isUser = async (req, res, next) => {
  try {
    const verifyToken = await tokenVerification(req);
    if (
      !verifyToken.isValid ||
      verifyToken.data.role !== config.role.USER_ROLE
    ) {
      return res.status(403).json({
        status: false,
        message: config.statusMessage.PERMISSION_DENIED,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

module.exports = {
  generateAccessToken,
  isAdmin,
  isUser,
};
