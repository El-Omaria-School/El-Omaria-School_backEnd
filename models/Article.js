const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "you must enter an title!"],
  },
  body: {
    type: String,
    required: [true, "you must enter a First Name!"],
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

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
