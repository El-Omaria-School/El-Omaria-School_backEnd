const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "you must enter course name"],
  },
  description: {
    type: String,
    // required: [true, "you must enter course description"],
  },
  image: {
    type: String,
    // required: [true, "you must upload course image"],
  },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
