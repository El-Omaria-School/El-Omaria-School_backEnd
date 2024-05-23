const bcrypt = require("bcrypt");
const { notFoundError } = require("../handleErrors/notFoundError");
const User = require("../models/user");

class UserRepository {
  async createNewUser(body) {
    const passwordHash = await bcrypt.hash(body.password, 10);
    await User.create({ ...body, password: passwordHash });
    return "User created successfull";
  }

  async findUserByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async getAllUser() {
    const users = await User.find();
    if (!users) throw new notFoundError("No users found!");
    return users;
  }
}

module.exports = UserRepository;
