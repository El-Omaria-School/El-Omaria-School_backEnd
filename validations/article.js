const joi = require("joi");

const articleSchema = joi.object({
  title: joi.string().required(),
  body: joi.string().required(),
  images: joi.array().items(joi.string()),
});

const validatArticle = (article) => articleSchema.validate(article);

module.exports = { validatArticle };
