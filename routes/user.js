const express = require("express");
const { handleAsync } = require("../handleErrors/handleAsync");

const router = express.Router();

const userRouter = (userController) => {
  router.post(
    "/",
    handleAsync(async (req, res) => {
      const user = await userController.createNewUser(req.body);
      res
        .status(201)
        .json({ message: "User registered. Please verify your email.", user });
    })
  );

  router.post(
    "/login/password",
    handleAsync(async (req, res) => {
      const token = await userController.loginWithPassword(req.body);
      res.status(200).json({ success: true, token: token });
    })
  );

  router.post(
    "/login/otp",
    handleAsync(async (req, res) => {
      await userController.sendOtpForLogin(req.body.email);
      res
        .status(200)
        .json({ success: true, message: "OTP sent to your email" });
    })
  );

  router.post(
    "/login/otp/verify",
    handleAsync(async (req, res) => {
      const token = await userController.verifyOtpAndLogin(req.body);
      res.status(200).json({ success: true, token: token });
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
