const joi = require("joi");

const lessonSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  lessonNumber: joi.number().required(),
  videoUrl: joi.string().required(),
  courseId: joi.string().required(),
  image: joi.string()
});

const validateLesson = (lesson) => lessonSchema.validate(lesson);

module.exports = { validateLesson };
