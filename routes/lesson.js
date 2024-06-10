const express = require("express");
const { handleAsync } = require("../handleErrors/handleAsync");
const { admin } = require("../middleware/admin");
const { auth } = require("../middleware/auth");
const router = express.Router();

const lessonRouter = (lessonController) => {
  router.get(
    "/",
    handleAsync(async (req, res) => {
      const lessons = await lessonController.getAllLessons();

      res.status(200).json({ success: true, data: lessons });
    })
  );

  router.get(
    "/course/:id",
    auth,
    handleAsync(async (req, res) => {
      const lessons = await lessonController.getCourseLessons(req.params.id);
      res.status(200).json({ success: true, data: lessons });
    })
  );

  router.get(
    "/:id",
    auth,
    handleAsync(async (req, res) => {
      const lessons = await lessonController.getLessonById(req.params.id);
      res.status(200).json({ success: true, data: lessons });
    })
  );

  router.post(
    "/",
    admin,
    handleAsync(async (req, res) => {
      const newlesson = await lessonController.addLesson(req.body);
      res.status(201).json({ success: true, data: newlesson });
    })
  );

  router.patch(
    "/:id",
    admin,
    handleAsync(async (req, res) => {
      await lessonController.editLesson(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, data: "lesson updated successfully" });
    })
  );
  
  router.delete(
    "/:id",
    admin,
    handleAsync(async (req, res) => {
      await lessonController.deleteLesson(req.params.id);
      res
        .status(200)
        .json({ success: true, data: "lesson deleted successfully" });
    })
  );

  return router;
};

module.exports = lessonRouter;
