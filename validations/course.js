const joi = require("joi");

const courseSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  image: joi.string()
});

const validateCourse = (course) => courseSchema.validate(course);

module.exports = { validateCourse };
