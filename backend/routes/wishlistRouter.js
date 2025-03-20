const { body } = require("express-validator");
const wishlistController = require("../controllers/wishlistController");
const express = require("express");
const MSG = require("../services/message");
const router = express.Router();

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
  wishlistController.addWishlist
);
router.delete("/delete/:id", wishlistController.deleteWishlist);

module.exports = router;
