const joi = require("joi");

const articleSchema = joi.object({
  title: joi.string().required(),
  body: joi.string().required(),
  image: joi.string(),
});

const validatArticle = (article) => articleSchema.validate(article);

module.exports = { validatArticle };
