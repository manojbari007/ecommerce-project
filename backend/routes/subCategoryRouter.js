const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController");
const { body } = require("express-validator");
const MSG = require("../services/message");

router.get("/list", subCategoryController.subCategoryList);
// router.get("/admin/list", subCategoryController.subCategoryList);
router.post(
  "/add",
  body("categoryId").notEmpty().withMessage(MSG.CATEGORY_ID_REQUIRED),
  body("name").notEmpty().withMessage(MSG.SUBCATEGORY_NAME_REQUIRED),
  subCategoryController.addSubCategory
);

router.put(
  "/update/:id",
  body("categoryId").notEmpty().withMessage(MSG.CATEGORY_ID_REQUIRED),
  body("name").notEmpty().withMessage(MSG.SUBCATEGORY_NAME_REQUIRED),
  subCategoryController.updateSubCategory
);
router.delete("/delete/:id", subCategoryController.deleteSubCategory);

module.exports = router;
