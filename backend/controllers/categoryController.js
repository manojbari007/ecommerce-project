const Category = require("../models/categoryModel");
const { HttpStatus, ErrorCode } = require("../services/error");
const MSG = require("../services/message");
const Services = require("../services/validator");
const send = Services.sendResponse;
//admin  side api
// create new Category
exports.addCategory = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const { name, status } = req.body;
    const category = new Category({ name, status });
    const newCategory = await category.save();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        addCategory: newCategory,
      })
    );
  } catch (error) {
    res.send(
      Services.prepareResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        MSG.INTERNAL_SERVER_ERROR,
        {
          error: error.message,
        }
      )
    );
  }
};
//update category
exports.updateCategory = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const categoryId = req.params.id;
    const { name, status } = req.body;
    const category = await Category.findByIdAndUpdate(categoryId, {
      name,
      status,
      updateAt: new Date().toISOString(),
    });
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        updateCategory: category,
      })
    );
  } catch (error) {
    res.send(
      Services.prepareResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        MSG.INTERNAL_SERVER_ERROR,
        {
          error: error.message,
        }
      )
    );
  }
};

//delete category
exports.deleteCategory = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }

    const category = await Category.findByIdAndDelete(req.params.id, {
      isDeleted: true,
    });
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "Category deleted successfully",
      })
    );
  } catch (error) {
    res.send(
      Services.prepareResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        MSG.INTERNAL_SERVER_ERROR,
        { error: error.message }
      )
    );
  }
};

//get all category
exports.categoryList = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const list = await Category.find({ isDeleted: false });
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        categoryList: list,
      })
    );
  } catch (error) {
    res.send(
      Services.prepareResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        MSG.INTERNAL_SERVER_ERROR,
        {
          error: error.message,
        }
      )
    );
  }
};
