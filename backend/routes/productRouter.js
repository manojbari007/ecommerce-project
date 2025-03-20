const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { body } = require("express-validator");
const MSG = require("../services/message");

router.get("/list", productController.productList);
router.get("/details/:id", productController.productDetail);
router.post(
  "/add",
  body("categoryId")
    .notEmpty()
    .withMessage(MSG.CATEGORY_ID_REQUIRED)
    .isMongoId()
    .withMessage(MSG.INVALID_CATEGORY_ID),
  body("subCategoryId")
    .notEmpty()
    .withMessage(MSG.SUBCATEGORY_ID_REQUIRED)
    .isMongoId()
    .withMessage(MSG.INVALID_SUBCATEGORY_ID),
  body("name").notEmpty().withMessage(MSG.PRODUCT_NAME_REQUIRED),
  body("image")
    .notEmpty()
    .withMessage(MSG.IMAGE_REQUIRED)
    .isURL()
    .withMessage(MSG.INVALID_IMAGE_URL),
  body("description").notEmpty().withMessage(MSG.DESCRIPTION_REQUIRED),
  body("quantity").notEmpty().withMessage(MSG.QUANTITY_REQUIRED),
  body("price").notEmpty().withMessage(MSG.PRICE_REQUIRED),
  productController.addProduct
);
router.put(
  "/update/:id",
  body("categoryId")
    .notEmpty()
    .withMessage(MSG.CATEGORY_ID_REQUIRED)
    .isMongoId()
    .withMessage(MSG.INVALID_CATEGORY_ID),
  body("subCategoryId")
    .notEmpty()
    .withMessage(MSG.SUBCATEGORY_ID_REQUIRED)
    .isMongoId()
    .withMessage(MSG.INVALID_SUBCATEGORY_ID),
  body("name").notEmpty().withMessage(MSG.PRODUCT_NAME_REQUIRED),
  body("image")
    .notEmpty()
    .withMessage(MSG.IMAGE_REQUIRED)
    .isURL()
    .withMessage(MSG.INVALID_IMAGE_URL),
  body("description").notEmpty().withMessage(MSG.DESCRIPTION_REQUIRED),
  body("quantity").notEmpty().withMessage(MSG.QUANTITY_REQUIRED),
  body("price").notEmpty().withMessage(MSG.PRICE_REQUIRED),
  productController.updateProduct
);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
