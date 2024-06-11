const joi = require("joi");

const blogSchema = joi.object({
  content: joi.string().required(),
  image: joi.string(),
});

const validatBlog = (blog) => blogSchema.validate(blog);

module.exports = { validatBlog };
