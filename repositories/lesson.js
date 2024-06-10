const Lesson = require('../models/Lesson')
const NotFoundError = require('../handleErrors/notFoundError')

class LessonRepository {
  async getAllLessons() {
    const lessons = await Lesson.find().populate("courseId")
    if (!lessons.length) {
      throw new NotFoundError('No Lessons found')
    }
    return lessons
  }

  async getLessonById(id){
    const lesson = await Lesson.findOne({_id: id}).populate("courseId")
    if (!lesson) {
      throw new NotFoundError('No lesson found with this id')
    }
    return lesson
  }

  async getCourseLessons(courseId){
    const lessons = await Lesson.find({courseId}).populate("courseId")
    if (!lessons.length) {
      throw new NotFoundError('No Lessons found for this course')
    }
    return lessons
  }

  async addLesson(body) {
    await Lesson.create(body)
  }

  async editLesson(id, body) {
    await Lesson.updateOne({ _id: id }, body)
  }

  async deleteLesson(id) {
    await Lesson.deleteOne({ _id: id })
  }
}

module.exports = LessonRepository
