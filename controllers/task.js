const validationError = require("../handleErrors/validationError");
const { validateTask } = require("../validations/task");

class TaskController {
    constructor(taskRepository) {
      this.taskRepository = taskRepository
    }

   async getAllTasks() {
      return await this.taskRepository.getAllTasks()
    }
  
   async getLessonTasks(id) {
      return await this.taskRepository.getLessonTasks(id)
    }
  
   async addTask(newTask) {
    const { error } = validateTask(newTask);
    if (error) {
      throw new validationError(`Invalid data ${error.message}`);
    }
      return await this.taskRepository.addTask(newTask)
    }
  
   async editTask(id, body) {
      return await this.taskRepository.editTask(id, body)
    }
  
    async deleteTask(id) {
      return await this.taskRepository.deleteTask(id)
    }
}

module.exports = TaskController