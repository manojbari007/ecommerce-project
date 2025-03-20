const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { body } = require("express-validator");
const MSG = require("../services/message");

router.get("/list", categoryController.categoryList);

router.post(
  "/add",
  body("name").notEmpty().withMessage(MSG.CATEGORY_NAME_REQUIRED),
  categoryController.addCategory
);
router.put(
  "/update/:id",
  body("name").notEmpty().withMessage(MSG.CATEGORY_NAME_REQUIRED),
  categoryController.updateCategory
);
router.delete("/delete/:id", categoryController.deleteCategory);
module.exports = router;
