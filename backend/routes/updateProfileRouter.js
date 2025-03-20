const { body } = require("express-validator");
const updateProfileController = require("../controllers/updateProfileController");
const express = require("express");
const MSG = require("../services/message");
const router = express.Router();

router.put(
  "/update/:id",
  body("firstName").notEmpty().withMessage(MSG.FIRST_NAME_REQUIRED),
  body("lastName").notEmpty().withMessage(MSG.LAST_NAME_REQUIRED),
  body("email")
    .notEmpty()
    .withMessage(MSG.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(MSG.INVALID_EMAIL_FORMAT),
  body("mobileNumber")
    .notEmpty()
    .withMessage(MSG.MOBILE_NUMBER_REQUIRED)
    .isNumeric()
    .withMessage(MSG.INVALID_MOBILE_NUMBER)
    .isLength({ MIN: 10, MAX: 10 })
    .withMessage(MSG.MOBILE_NUMBER_MUST_BE_10_DIGIT),
  body("profileImage")
    .notEmpty()
    .withMessage(MSG.PROFILE_IMAGE_REQUIRED)
    .isURL()
    .withMessage(MSG.PROFILE_IMAGE_VALID_URL),
  body("gender")
    .notEmpty()
    .withMessage(MSG.GENDER_REQUIRED)
    .isIn(["male", "female"])
    .withMessage(MSG.GENDER_MUST_BE_MALE_OR_FEMALE),
  body("dob")
    .notEmpty()
    .withMessage(MSG.DATE_OF_BIRTH_REQUIRED)
    .matches(/^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/)
    .withMessage(MSG.INVALID_DATE_FORMAT),

  updateProfileController.updateProfile
);

module.exports = router;
