const Discount = require("../models/discountModel");
const { HttpStatus, ErrorCode } = require("../services/error");
const MSG = require("../services/message");
const Services = require("../services/validator");
const send = Services.sendResponse;
//admin- add  discount api
exports.addDiscount = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const { title, couponCode, type } = req.body;
    const newDiscount = await Discount({ title, couponCode, type });
    const savedDiscount = await newDiscount.save();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        addDiscount: savedDiscount,
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

//admin- update discount api
exports.updateDiscount = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const discountId = req.params.id;
    const { title, couponCode, type, status } = req.body;
    const discount = await Discount.findByIdAndUpdate(discountId, {
      title,
      couponCode,
      type,
      status,
      updateAt: Date.now(),
    });
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        updateDiscount: discount,
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

//admin- delete discount api
exports.deleteDiscount = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const { id } = req.params;
    const discount = await Discount.findById(id);
    if (!discount) {
      res.send(
        Services.prepareResponse(
          HttpStatus.NOT_FOUND,
          MSG.DISCOUNT_CODE_NOT_FOUND
        )
      );
    }

    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "Discount deleted successfully",
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

//user side api- view discount of user
exports.discountList = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }

    const discount = await Discount.find({});
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        list: discount,
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

//user side api -view discount details of user
exports.discountDetails = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const { id } = req.params;
    const discountId = await Discount.findOne({ _id: id, isDeleted: false });
    if (!discountId) {
      res.send(
        Services.prepareResponse(
          HttpStatus.NOT_FOUND,
          MSG.DISCOUNT_CODE_NOT_FOUND
        )
      );
    }
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        details: discountId,
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
