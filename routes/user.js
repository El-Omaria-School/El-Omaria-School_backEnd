const express = require("express");
const { handleAsync } = require("../handleErrors/handleAsync");

const router = express.Router();

const userRouter = (userController) => {
  router.post(
    "/",
    handleAsync(async (req, res) => {
      const newUser = await userController.createNewUser(req.body);
      res.status(201).json({ success: true, message: newUser });
    })
  );

  router.post(
    "/login",
    handleAsync(async (req, res) => {
      const logged = await userController.login(req.body);
      res.status(200).json({ success: true, token: logged });
    })
  );
  router.get(
    "/",
    handleAsync(async (req, res) => {
      const allUser = await userController.getAllUser();
      res.status(200).json({ success: true, data: allUser });
    })
  );

  return router;
};

module.exports = userRouter;
