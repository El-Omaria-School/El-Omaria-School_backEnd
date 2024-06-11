const Task = require('../models/Task')
const NotFoundError = require('../handleErrors/notFoundError')

class TaskRepository {
  async getAllTasks() {
    const tasks = await Task.find().populate("lessonId")
    if (!tasks.length) {
      throw new NotFoundError('No Tasks found')
    }
    return tasks
  }

  async getLessonTasks(lessonId){
    const tasks = await Task.find({lessonId})
    if (!tasks.length) {
      throw new NotFoundError('No Tasks found for this lesson')
    }
    return tasks
  }

  async addTask(body) {
    await Task.create(body)
  }

  async editTask(id, body) {
    await Task.updateOne({ _id: id }, body)
  }

  async deleteTask(id) {
    await Task.deleteOne({ _id: id })
  }
}

module.exports = TaskRepository
