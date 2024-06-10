const express = require("express");
const { handleAsync } = require("../handleErrors/handleAsync");
const { admin } = require("../middleware/admin");
const { auth } = require("../middleware/auth");
const router = express.Router();

const taskRouter = (taskController) => {
  router.get(
    "/",
    auth,
    handleAsync(async (req, res) => {
      const tasks = await taskController.getAllTasks();
      res.status(200).json({ success: true, data: tasks });
    })
  );

  router.get(
    "/:id",
    auth,
    handleAsync(async (req, res) => {
      const tasks = await taskController.getLessonTasks(req.params.id);
      res.status(200).json({ success: true, data: tasks });
    })
  );

  router.post(
    "/",
    admin,
    handleAsync(async (req, res) => {
      const newtask = await taskController.addTask(req.body);
      res.status(201).json({ success: true, data: newtask });
    })
  );

  router.patch(
    "/:id",
    admin,
    handleAsync(async (req, res) => {
      await taskController.editTask(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, data: "task updated successfully" });
    })
  );
  
  router.delete(
    "/:id",
    admin,
    handleAsync(async (req, res) => {
      await taskController.deleteTask(req.params.id);
      res
        .status(200)
        .json({ success: true, data: "task deleted successfully" });
    })
  );

  return router;
};

module.exports = taskRouter;
