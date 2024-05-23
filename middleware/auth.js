const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../constants");

const auth = async (req, res, next) => {
  try {
    const token = req.headers["jwt"];

    if (!token) {
      return res.status(401).send({ message: "UnAuthorized User" });
    }

    const payLoad = jwt.verify(token, JWT_SECRET);

    const { email } = payLoad;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: "UnAuthorized User" });
    }

    req.auth = user;

    next();
  } catch (err) {
    return res.status(401).send({ message: "UnAuthorized User" });
  }
};

module.exports = { auth };
