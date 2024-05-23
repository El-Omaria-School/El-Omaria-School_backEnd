const bcrypt = require("bcrypt");
const { notFoundError } = require("../handleErrors/notFoundError");
const User = require("../models/User");

class UserRepository {
  async createNewUser(body) {
    await User.create({ ...body });
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
  async updateProfile(email, body) {
    const user = await User.find({ email });
    if (!user) throw new notFoundError("User not found");

    const updated = await User.updateOne({ email }, body);

    return updated;
  }
}

module.exports = UserRepository;
