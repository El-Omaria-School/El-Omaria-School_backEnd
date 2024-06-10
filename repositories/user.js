const bcrypt = require("bcrypt");
const { notFoundError } = require("../handleErrors/notFoundError");
const User = require("../models/User");
const { options } = require("joi");

class UserRepository {
  async createNewUser(body) {
    await User.create({ ...body });
    return "User created successfull";
  }

  async findUserByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async getAllUser(skip, limit, email) {
    let users = null;
    let noOfDocuments = 0;
    if(email){
      noOfDocuments = await User.countDocuments({email: {$regex: email, $options: "i"}});
      users = await User.find({email: {$regex: email, $options: "i"}}).skip(skip).limit(limit)
    }else{
      noOfDocuments = await User.countDocuments();
      users = await User.find().skip(skip).limit(limit);
    }
    if (!users) throw new notFoundError("No users found!");
    return {noOfDocuments, users};
  }

  async updateProfile(email, body) {
    const user = await User.find({ email });
    if (!user) throw new notFoundError("User not found");

    const updated = await User.updateOne({ email }, body);

    return updated;
  }

  async update(email) {
    const user = await User.updateOne({ email }, { verified: true });

    return user;
  }
  
  async savePass(email, newPass) {
    const user = await User.updateOne({ email }, { password: newPass });
    return user;
  }

  async findUserById(id) {
    const user = await User.findOne({ _id: id });
    return user;
  }
}

module.exports = UserRepository;
