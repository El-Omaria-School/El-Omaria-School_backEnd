const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "you must enter an content!"],
  },
  image: {
    type: String,
    default: null,
  },
  dateCreated: {
    type: String,
    default: () => new Date().toLocaleString("en-US"),
  },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
