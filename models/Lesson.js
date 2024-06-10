const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "you must enter Lesson name"],
  },
  lessonNumber:{
    type: Number,
    required: [true, "you must enter Lesson number"],
    unique: false
  },
  description: {
    type: String,
    required: [true, "you must enter Lesson description"],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'course id is required'],
  },
  videoUrl: {
    type: String,
    required: [true, "you must enter lesson url"],
  }
});

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
