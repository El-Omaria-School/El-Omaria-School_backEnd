const joi = require("joi");

const taskSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  lessonId: joi.string().required()
});

const validateTask = (task) => taskSchema.validate(task);

module.exports = { validateTask };
