const SubCategory = require("../models/subCategoryModel");
const { HttpStatus, ErrorCode } = require("../services/error");
const MSG = require("../services/message");
const Services = require("../services/validator");
const send = Services.sendResponse;

//admin: list api
exports.subCategoryList = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const list = await SubCategory.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryList",
        },
      },
      {
        $unwind: {
          path: $categoryList,
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          "categoryId._id": 1,
          "categoryId.name": 1,
          name: 1,
        },
      },
    ]);
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        subCategoryList: list,
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

//admin: add api
exports.addSubCategory = async (req, res) => {
  try {
    const { categoryId, name, status } = req.body;
    const subCategory = new SubCategory({
      categoryId,
      name,
      status,
      createAt: Date.now(),
      isDeleted: false,
    });
    const newSubCategory = await subCategory.save();
    const populateSubCategory = await SubCategory.findOne({
      _id: newSubCategory._id,
      isDeleted: false,
    })
      .populate("categoryId", "name")
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        addSubCategory: populateSubCategory,
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
//admin:update subCategory
exports.updateSubCategory = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const subCategoryId = req.params.id;
    const { name, status } = req.body;
    const updateSubCategory = await SubCategory.findByIdAndUpdate(
      { _id: subCategoryId, isDeleted: false },
      {
        name,
        status,
        updateAt: Date.now(),
      }
    );
    const populateSubCategory = await SubCategory.findOne({
      _id: updateSubCategory._id,
    })
      .populate("categoryId", "name")
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        updateSubCategory: populateSubCategory,
      })
    );
  } catch (error) {
    res.send(
      Services.prepareResponse(ErrorCode, MSG.SUCCESS, {
        error: error.message,
      })
    );
  }
};
//admin:delete sub category
exports.deleteSubCategory = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const subCategoryId = req.params.id;
    const subCategory = await SubCategory.findByIdAndDelete(
      { _id: subCategoryId },
      {
        isDeleted: true,
      }
    );
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "Subcategory deleted successfully.",
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
//user-all subcategory list
exports.subCategoryList = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const list = await SubCategory.find({ isDeleted: false })
      .populate("categoryId", "name")
      .exec();

    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        subCategoryList: list,
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
