const { body } = require("express-validator");
const userController = require("../controllers/userController");
const express = require("express");
const MSG = require("../services/message");
const router = express.Router();

router.get("/list", userController.getAllUser);

router.post(
  "/signup",
  body("firstName").notEmpty().withMessage(MSG.FIRST_NAME_REQUIRED),
  body("lastName").notEmpty().withMessage(MSG.LAST_NAME_REQUIRED),
  body("mobileNumber")
    .notEmpty()
    .withMessage(MSG.MOBILE_NUMBER_REQUIRED)
    .isMobilePhone()
    .withMessage(MSG.INVALID_MOBILE_NUMBER),
  body("email")
    .notEmpty()
    .withMessage(MSG.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(MSG.INVALID_EMAIL_FORMAT),
  body("password").notEmpty().withMessage(MSG.PASSWORD_REQUIRED),
  userController.signUp
);

router.post(
  "/login",
  body("email").notEmpty().withMessage(MSG.EMAIL_REQUIRED),
  body("password").notEmpty().withMessage(MSG.PASSWORD_REQUIRED),
  userController.login
);

router.put(
  "/update-password/:id",
  body("oldPassword").notEmpty().withMessage(MSG.OLD_PASSWORD_REQUIRED),
  body("newPassword").notEmpty().withMessage(MSG.NEW_PASSWORD_REQUIRED),
  userController.updatePassword
);

router.post(
  "/forget-password",
  body("email")
    .notEmpty()
    .withMessage(MSG.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(MSG.INVALID_EMAIL_FORMAT),
  userController.forgetPassword
);

router.delete("/delete/:id", userController.deleteUser);
module.exports = router;
