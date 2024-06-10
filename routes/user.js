const express = require("express");
const { handleAsync } = require("../handleErrors/handleAsync");
const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

const router = express.Router();

const userRouter = (userController) => {
  router.post(
    //step1
    "/",
    handleAsync(async (req, res) => {
      const user = await userController.createNewUser(req.body);
      res
        .status(200)
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
    admin,
    handleAsync(async (req, res) => {
      const allUser = await userController.getAllUser(req);
      res.status(200).json({ success: true, data: allUser });
    })
  );

  router.patch(
    "/",
    auth,
    handleAsync(async (req, res) => {
      const updated = await userController.UpdateUserProfile(
        req.auth,
        req.body
      );
      res.status(200).json({ success: true, message: updated });
    })
  );

  router.get(
    "/profile",
    auth,
    handleAsync(async (req, res) => {
      const profile = await userController.getCurrentUserProfile(req.auth);
      res.status(200).json({ success: true, data: profile });
    })
  );

  return router;
};

module.exports = userRouter;
