const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "you must enter Task name"],
  },
  description: {
    type: String,
    required: [true, "you must enter Task description"],
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'lesson id is required'],
  }
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
