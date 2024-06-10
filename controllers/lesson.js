const BadRequestError = require("../handleErrors/badRequestError");
const validationError = require("../handleErrors/validationError");
const { validateLesson } = require("../validations/lesson");

class LessonController {
    constructor(lessonRepository) {
      this.lessonRepository = lessonRepository
    }

   async getAllLessons() {
      return await this.lessonRepository.getAllLessons()
    }
  
   async getCourseLessons(id) {
     const lessons = await this.lessonRepository.getCourseLessons(id)
     const sortedLessons = lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
      return sortedLessons
    }

   async getLessonById(id) {    
      return await this.lessonRepository.getLessonById(id)
    }
  
   async addLesson(newLesson) {
    const { error } = validateLesson(newLesson);
    console.log(newLesson)
    if (error) {
      throw new validationError(`Invalid data ${error.message}`);
    }
      let lessons = [];
      try{
        lessons = await this.lessonRepository.getCourseLessons(newLesson.courseId)
      }catch(err){
      }
      const lessonByNumber = lessons.find((lesson)=> lesson.lessonNumber == newLesson.lessonNumber)
      if(lessonByNumber){
        throw new BadRequestError("Lesson number must be unique")
      }
      return await this.lessonRepository.addLesson(newLesson)
    }
  
   async editLesson(id, body) {
      return await this.lessonRepository.editLesson(id, body)
    }
  
    async deleteLesson(id) {
      return await this.lessonRepository.deleteLesson(id)
    }
}

module.exports = LessonController