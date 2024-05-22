const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "you must enter a First Name!"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "you must enter an email!"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  phoneNumber: {
    type: String,
    match: [/^\d{11}$/, "Phone number must be 11 digits"],
  },
  role: {
    type: String,
    enum: ["Admin", "Student"],
    required: [true, "Role is required"],
    default: "Student",
  },
  password: {
    type: String,
    required: [true, "you must enter a password!"],
    minlength: 8,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  verified: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
