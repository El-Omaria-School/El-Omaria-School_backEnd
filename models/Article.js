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
  images: [
    {
      type: String,
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
