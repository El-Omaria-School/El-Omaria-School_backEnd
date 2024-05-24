const express = require("express");
const { handleAsync } = require("../handleErrors/handleAsync");

const router = express.Router();

const userRouter = (userController) => {
  router.post(
    //step1
    "/",
    handleAsync(async (req, res) => {
      const user = await userController.createNewUser(req.body);
      res
        .status(201)
        .json({ message: "User registered. Please verify your email.", user });
    })
  );

  router.post(
    //step3
    "/login",
    handleAsync(async (req, res) => {
      const token = await userController.login(req.body);
      res.status(200).json({ success: true, token: token });
    })
  );

  router.post(
    //not verified navigate to resend otp
    "/resend-otp",
    handleAsync(async (req, res) => {
      await userController.resendOtp(req.body.email);
      res
        .status(200)
        .json({ success: true, message: "OTP sent to your email" });
    })
  );

  router.post(
    //step2
    "/otp-verify",
    handleAsync(async (req, res) => {
      const token = await userController.verifyOtp(req.body);
      res.status(200).json({ success: true, token: token });
    })
  );

  router.post(
    "/forgot-password",
    handleAsync(async (req, res) => {
      await userController.resendOtp(req.body.email);
      res
        .status(200)
        .json({ success: true, message: "OTP sent to your email" });
    })
  );

  router.post(
    "/reset-password",
    handleAsync(async (req, res) => {
      await userController.resetPassword(req.body);
      res
        .status(200)
        .json({ success: true, message: "Password reset successfully" });
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
