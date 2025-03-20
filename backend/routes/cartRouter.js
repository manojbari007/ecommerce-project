const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { body } = require("express-validator");
const MSG = require("../services/message");

router.post(
  "/add",
  body("userId")
    .notEmpty()
    .withMessage(MSG.USER_ID_REQUIRED)
    .isMongoId()
    .withMessage(MSG.INVALID_USER_ID),
  body("productId")
    .notEmpty()
    .withMessage(MSG.PRODUCT_ID_REQUIRED)
    .isMongoId()
    .withMessage(MSG.INVALID_PRODUCT_ID),
  body("quantity").isInt({ min: 1 }).withMessage(MSG.QUANTITY_REQUIRED),
  body("price").notEmpty().withMessage(MSG.PRICE_REQUIRED),
  cartController.addCart
);
router.put(
  "/update/:id",
  body("userId")
    .notEmpty()
    .withMessage(MSG.USER_ID_REQUIRED)
    .isMongoId()
    .withMessage(MSG.INVALID_USER_ID),
  body("productId")
    .notEmpty()
    .withMessage(MSG.PRODUCT_ID_REQUIRED)
    .isMongoId()
    .withMessage(MSG.INVALID_PRODUCT_ID),
  body("quantity").isInt({ min: 0 }).withMessage(MSG.QUANTITY_REQUIRED),
  body("price").notEmpty().withMessage(MSG.PRICE_REQUIRED),
  cartController.updateCart
);
router.delete("/delete/:id", cartController.deleteCart);

module.exports = router;
