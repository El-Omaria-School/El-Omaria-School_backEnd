const mongoose = require("mongoose");

const tasksDoneSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user id is required'],
  },
  
});

const TasksDone = mongoose.model("TasksDone", tasksDoneSchema);
module.exports = TasksDone;
