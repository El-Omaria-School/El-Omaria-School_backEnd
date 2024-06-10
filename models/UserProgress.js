const mongoose = require("mongoose");

const userProgessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user id is required'],
  },
  lessonsIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: [true, 'Lesson id is required'],
    }
  ],
  tasksIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'tasks arr is required'],
  }],
});

const UserProgess = mongoose.model("UserProgess", userProgessSchema);
module.exports = UserProgess;
