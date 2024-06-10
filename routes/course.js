const express = require("express");
const { handleAsync } = require("../handleErrors/handleAsync");
const { admin } = require("../middleware/admin");
const { uploadSingle } = require("../middleware/Multer");
const { uploadImage } = require("../middleware/firebase");
const { auth } = require("../middleware/auth");
const router = express.Router();

const courseRouter = (courseController) => {
  router.get(
    "/",
    handleAsync(async (req, res) => {
      const courses = await courseController.getAllCourses();

      res.status(200).json({ success: true, data: courses });
    })
  );

  router.get(
    "/:id",
    auth,
    handleAsync(async (req, res) => {
      const courses = await courseController.getCourseById(req.params.id);
      res.status(200).json({ success: true, data: courses });
    })
  );

  router.post(
    "/",
    uploadSingle,
    uploadImage,
    admin,
    handleAsync(async (req, res) => {
      const newcourse = await courseController.addCourse(req.body);
      res.status(201).json({ success: true, data: newcourse });
    })
  );

  router.patch(
    "/:id",
    uploadSingle,
    uploadImage,
    admin,
    handleAsync(async (req, res) => {
      await courseController.editCourse(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, data: "course updated successfully" });
    })
  );
  
  router.delete(
    "/:id",
    admin,
    handleAsync(async (req, res) => {
      await courseController.deleteCourse(req.params.id);
      res
        .status(200)
        .json({ success: true, data: "course deleted successfully" });
    })
  );

  return router;
};

module.exports = courseRouter;
