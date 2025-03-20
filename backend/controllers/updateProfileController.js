const User = require("../models/userModel");
const { HttpStatus, ErrorCode } = require("../services/error");
const Services = require("../services/validator");
const MSG = require("../services/message");
const send = Services.sendResponse;

//update user Profile
exports.updateProfile = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const userId = req.params.id;
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      profileImage,
      gender,
      dob,
      status,
    } = req.body;

    const user = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      email,
      mobileNumber,
      profileImage,
      gender,
      dob,
      status,
      updateAt: Date.now(),
    });

    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "Profile updated successfully",
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
