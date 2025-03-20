const UserAddress = require("../models/userAddressModel");
const { HttpStatus, ErrorCode } = require("../services/error");
const MSG = require("../services/message");
const Services = require("../services/validator");
const send = Services.sendResponse;

//user-add address
exports.addUserAddress = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const {
      userId,
      type,
      houseNo,
      area,
      landmark,
      pinCode,
      city,
      state,
      status,
    } = req.body;
    if (!userId) {
      res.status(400).json("User Id is required");
    }
    const newAddress = await UserAddress({
      userId,
      type,
      houseNo,
      area,
      landmark,
      pinCode,
      city,
      state,
      status,
      createAt: Date.now(),
    });

    const saveAddress = await newAddress.save();
    const populateAddress = await UserAddress.findOne({
      _id: saveAddress._id,
      isDeleted: false,
    })
      .populate("userId", "firstName lastName  email mobileNumber dob")
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        addUserAddress: populateAddress,
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

//user:list all address
exports.userAddressList = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const userAddress = await UserAddress.find({ isDeleted: false });

    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        list: userAddress,
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
//user-update user address
exports.updateUserAddress = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const addressId = req.params.id;
    const {
      userId,
      houseNo,
      area,
      type,
      landmark,
      pinCode,
      city,
      state,
      status,
    } = req.body;
    const updateAddress = await UserAddress.findByIdAndUpdate(
      {
        _id: addressId,
        isDeleted: false,
      },
      {
        userId,
        houseNo,
        area,
        type,
        landmark,
        pinCode,
        city,
        state,
        status,
        updateAt: Date.now(),
      }
    );
    const populateAddress = await UserAddress.findOne({
      _id: updateAddress._id,
      isDeleted: false,
    })
      .populate("userId", "firstName lastName  email mobileNumber dob")
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        update: populateAddress,
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
//user-delete address
exports.deleteUserAddress = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const userAddressId = req.params.id;
    const deleteAddress = await UserAddress.findByIdAndDelete(
      { _id: userAddressId },
      { isDeleted: true }
    );
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "User Address deleted successfully",
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
