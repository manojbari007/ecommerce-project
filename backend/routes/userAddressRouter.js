const { body } = require("express-validator");
const userAddressController = require("../controllers/userAddressController");
const express = require("express");
const MSG = require("../services/message");
const router = express.Router();

router.get("/list", userAddressController.userAddressList);
router.post(
  "/add",
  body("userId").notEmpty().withMessage(MSG.USER_ID_REQUIRED),
  body("houseNo")
    .notEmpty()
    .withMessage(MSG.HOUSE_NO_REQUIRED)
    .isAlphanumeric()
    .withMessage(MSG.HOUSE_NO_ALPHANUMERIC),
  body("area").notEmpty().withMessage(MSG.AREA_REQUIRED),
  body("type").notEmpty().withMessage(MSG.ADDRESS_TYPE_REQUIRED),
  body("landmark").notEmpty().withMessage(MSG.LANDMARK_REQUIRED),
  body("pinCode").notEmpty().withMessage(MSG.PIN_CODE_REQUIRED),
  body("city").notEmpty().withMessage(MSG.CITY_REQUIRED),
  body("state").notEmpty().withMessage(MSG.STATE_REQUIRED),
  userAddressController.addUserAddress
);
router.put(
  "/update/:id",
  body("userId").notEmpty().withMessage(MSG.USER_ID_REQUIRED),
  body("houseNo")
    .notEmpty()
    .withMessage(MSG.HOUSE_NO_REQUIRED)
    .isAlphanumeric()
    .withMessage(MSG.HOUSE_NO_ALPHANUMERIC),
  body("area").notEmpty().withMessage(MSG.AREA_REQUIRED),
  body("type").notEmpty().withMessage(MSG.ADDRESS_TYPE_REQUIRED),
  body("landmark").notEmpty().withMessage(MSG.LANDMARK_REQUIRED),
  body("pinCode")
    .notEmpty()
    .withMessage(MSG.PIN_CODE_REQUIRED)
    .isPostalCode()
    .withMessage(MSG.INVALID_PIN_CODE),
  body("city").notEmpty().withMessage(MSG.CITY_REQUIRED),
  body("state").notEmpty().withMessage(MSG.STATE_REQUIRED),
  userAddressController.updateUserAddress
);
router.delete("/delete/:id", userAddressController.deleteUserAddress);

module.exports = router;
