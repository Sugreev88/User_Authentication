const express = require("express");
const router = express.Router();
const {
  createUser,
  verifyMobile,
  verifyOtp,
  userLogin,
  verifyEmail,
  verifyEmailOtp,
  loginViaToken,
  verifyLogintoken,
  logout,
} = require("../controller/authController");

router.route("/signup").post(createUser);
router.route("/verify/mobile").post(verifyMobile);
router.route("/verify/mobile/otp").post(verifyOtp);
router.route("/verify/email").post(verifyEmail);
router.route("/verify/email/otp").post(verifyEmailOtp);
router.route("/login").post(userLogin);
router.route("/login/token").post(loginViaToken);
router.route("/logout").post(verifyLogintoken, logout);
module.exports = router;
