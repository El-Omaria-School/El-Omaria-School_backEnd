const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../constants");

const admin = async (req, res, next) => {
  try {
    const token = req.headers["jwt"];

    if (!token) {
      return res.status(401).send({ message: "permission denied" });
    }

    const payLoad = jwt.verify(token, JWT_SECRET);

    const { email } = payLoad;

    const user = await User.findOne({ email });

    if (user.role !== "admin") {
      return res.status(401).send({ message: "permission denied" });
    }

    req.auth = user;

    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

module.exports = { admin };
