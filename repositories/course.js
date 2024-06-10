const Course = require('../models/Course')
const NotFoundError = require('../handleErrors/notFoundError')

class CourseRepository {
  async getAllCourses() {
    const courses = await Course.find()
    if (!courses.length) {
      throw new NotFoundError('No Courses found')
    }
    return courses
  }

  async getCourseById(id){
    const course = await Course.findOne({_id: id})
    if (!course) {
      throw new NotFoundError('No Course found with this id')
    }
    return course
  }

  async addCourse(body) {
    await Course.create(body)
  }

  async editCourse(id, body) {
    await Course.updateOne({ _id: id }, body)
  }

  async deleteCourse(id) {
    await Course.deleteOne({ _id: id })
  }
}

module.exports = CourseRepository
