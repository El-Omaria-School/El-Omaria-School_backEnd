const express = require("express");
const { handleAsync } = require("../handleErrors/handleAsync");
const { admin } = require("../middleware/admin");
const { auth } = require("../middleware/auth");

const router = express.Router();

const userProgressRouter = (userProgressController) => {
  router.get(
    "/:userId",
    auth,
    handleAsync(async (req, res) => {
      const data = await userProgressController.getUserProgress(req.params.userId);
      res.status(200).json({ success: true, data: data });
    })
  )

  router.post(
    "/open-lesson/:userId/:lessonId",
    admin,
    handleAsync(async (req, res) => {
      await userProgressController.openLesson(req.params.userId, req.params.lessonId);
      res.status(200).json({ success: true, message: "User lesson opened" });
    })
  )

  router.post(
    "/task-done/:userId/:taskId",
    admin,
    handleAsync(async (req, res) => {
      await userProgressController.taskDone(req.params.userId, req.params.taskId);
      res.status(200).json({ success: true, message: "Task done" });
    })
  )

  return router;
};

module.exports = userProgressRouter;
