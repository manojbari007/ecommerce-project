const Product = require("../models/productModel");
const { HttpStatus, ErrorCode } = require("../services/error");
const MSG = require("../services/message");
const Services = require("../services/validator");
const send = Services.sendResponse;
//admin: add api
exports.addProduct = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const {
      categoryId,
      subCategoryId,
      name,
      image,
      description,
      quantity,
      price,
      status,
    } = req.body;
    if (!categoryId || !subCategoryId) {
      res.send(
        Services.prepareResponse(HttpStatus.BAD_REQUEST, MSG.FIELD_REQUIRED, {
          error: "categoryId and subCategoryId  field is required",
        })
      );
    }
    const product = new Product({
      categoryId,
      subCategoryId,
      name,
      image,
      description,
      quantity,
      price,
      status,
      createdAt: Date.now(),
    });
    const saveProduct = await product.save();
    const populateProduct = await Product.find({
      _id: saveProduct._id,
      isDeleted: false,
    })
      .populate("categoryId", "name")
      .populate("subCategoryId", "name")
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        addProduct: populateProduct,
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
//admin: update product
exports.updateProduct = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const productId = req.params.id;
    const {
      categoryId,
      subCategoryId,
      name,
      image,
      description,
      quantity,
      price,
      status,
    } = req.body;
    const updateProduct = await Product.findByIdAndUpdate(
      { _id: productId, isDeleted: false },
      {
        categoryId,
        subCategoryId,
        name,
        image,
        description,
        quantity,
        price,
        status,
        updatedAt: Date.now(),
      }
    );
    const populateProduct = await Product.findOne({ _id: updateProduct._id })
      .populate("categoryId", "name")
      .populate("subCategoryId", "name")
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        updateProduct: populateProduct,
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

//admin:delete api
exports.deleteProduct = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const productId = req.params.id;
    const product = Product.findByIdAndDelete(
      { _id: productId },
      { isDeleted: true }
    );
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "Product deleted successfully",
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

//user- list  api
exports.productList = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const product = await Product.aggregate([
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
          as: "categoryId",
        },
      },
      {
        $unwind: {
          path: "$categoryId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "subCategoryId",
        },
      },
      {
        $unwind: {
          path: "$subCategoryId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          "categoryId._id": 1,
          "categoryId.name": 1,
          "subCategoryId._id": 1,
          "subCategoryId.name": 1,
          name: 1,
          image: 1,
          description: 1,
          price: 1,
        },
      },
    ]);
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        Details: product,
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
//admin & user:  details api
exports.productDetail = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const productId = req.params.id;
    const product = await Product.findById({
      _id: productId,
      isDeleted: false,
    })
      .populate("categoryId", "name")
      .populate("subCategoryId", "name")
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        Details: product,
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
