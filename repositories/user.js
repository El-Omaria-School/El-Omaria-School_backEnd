const bcrypt = require("bcrypt");
const { NotFoundError } = require("../Errors/NotFoundError");
const { InternalServerError } = require("../Errors/InternalServerError");
const User = require("../models/User");
const { deleteImages } = require("../middlewares/firebase");

class UserRepository {
  async createNewUser(body) {
    const passwordHash = await bcrypt.hash(body.password, 10);
    if (!passwordHash)
      throw new InternalServerError("Error while hashed password");
    await User.create({ ...body, password: passwordHash });
    return "User created successfull";
  }

  async findUserByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async getAllUser() {
    const users = await User.find();
    if (!users) throw new NotFoundError("No users found!");
    return users;
  }
}

module.exports = UserRepository;
