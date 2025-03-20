const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { body } = require("express-validator");
const MSG = require("../services/message");

router.get("/list", reviewController.reviewList);
router.get("/details/:id", reviewController.reviewDetails);
router.post(
  "/add",
  body("userId").notEmpty().withMessage(MSG.USER_ID_REQUIRED),
  body("productId").notEmpty().withMessage(MSG.PRODUCT_ID_REQUIRED),
  body("rating").notEmpty().withMessage(MSG.RATING_REQUIRED),
  body("comment").notEmpty().withMessage(MSG.COMMENT_REQUIRED),
  reviewController.addReview
);

router.delete("/delete/:id", reviewController.deleteReview);

module.exports = router;
