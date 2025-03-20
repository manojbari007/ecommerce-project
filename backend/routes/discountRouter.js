const express = require("express");
const discountController = require("../controllers/discountController");
const { body } = require("express-validator");
const MSG = require("../services/message");
const router = express.Router();

router.get("/list", discountController.discountList);
router.get("/details/:id", discountController.discountDetails);
router.post(
  "/add",
  body("title").notEmpty().withMessage(MSG.DISCOUNT_TITLE_REQUIRED),
  body("couponCode").notEmpty().withMessage(MSG.COUPON_CODE_REQUIRED),
  body("type").notEmpty().withMessage(MSG.DISCOUNT_TYPE_REQUIRED),
  discountController.addDiscount
);
router.put(
  "/update/:id",
  body("title").notEmpty().withMessage(MSG.DISCOUNT_TITLE_REQUIRED),
  body("couponCode").notEmpty().withMessage(MSG.COUPON_CODE_REQUIRED),
  body("type").notEmpty().withMessage(MSG.DISCOUNT_TYPE_REQUIRED),
  discountController.updateDiscount
);
router.delete("/delete/:id", discountController.deleteDiscount);

module.exports = router;
