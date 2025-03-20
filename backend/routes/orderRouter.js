const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { body } = require("express-validator");
const MSG = require("../services/message");

router.get("/list", orderController.orderList);
router.get("/details/:id", orderController.getOrderDetails);
router.post(
  "/add",
  body("userId").notEmpty().withMessage(MSG.USER_ID_REQUIRED),
  body("productId").notEmpty().withMessage(MSG.PRODUCT_ID_REQUIRED),
  body("userAddressId").notEmpty().withMessage(MSG.USER_ADDRESS_ID_REQUIRED),
  body("quantity").isInt({ min: 1 }).withMessage(MSG.QUANTITY_REQUIRED),
  body("couponCode").isString().withMessage(MSG.COUPON_CODE_REQUIRED),
  body("totalAmount").isInt({ min: 0 }).withMessage(MSG.TOTAL_AMOUNT_REQUIRED),
  body("paymentType").isIn([0, 1, 2]).withMessage(MSG.PAYMENT_TYPE_REQUIRED),
  orderController.addOrder
);
router.put(
  "/update/:id",
  body("paymentStatus").notEmpty().withMessage(MSG.PAYMENT_STATUS_REQUIRED),
  body("orderStatus").notEmpty().withMessage(MSG.ORDER_STATUS_REQUIRED),
  body("shippingStatus").notEmpty().withMessage(MSG.SHIPPING_STATUS_REQUIRED),
  orderController.updateOrder
);
router.delete("/delete/:id", orderController.deleteOrder);

module.exports = router;
