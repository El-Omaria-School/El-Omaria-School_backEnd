const validationError = require("../handleErrors/validationError");
const { validateCourse } = require("../validations/course");

class CourseController {
    constructor(courseRepository) {
      this.courseRepository = courseRepository
    }

   async getAllCourses() {
      return await this.courseRepository.getAllCourses()
    }
  
   async getCourseById(id) {
      return await this.courseRepository.getCourseById(id)
    }
  
   async addCourse(newCourse) {
    const { error } = validateCourse(newCourse);
    if (error) {
      throw new validationError(`Invalid data ${error.message}`);
    }

      return await this.courseRepository.addCourse(newCourse)
    }
  
   async editCourse(id, body) {
      return await this.courseRepository.editCourse(id, body)
    }
  
    async deleteCourse(id) {
      return await this.courseRepository.deleteCourse(id)
    }

  }
  module.exports = CourseController
  