const User = require("../models/userModel");
const { HttpStatus, ErrorCode } = require("../services/error");
const Services = require("../services/validator");
const MSG = require("../services/message");
const send = Services.sendResponse;
const sendEmail = require("../middlewares/mailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const transporter = require("../middlewares/mailer");
require("dotenv").config();
//user: signup
exports.signUp = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const { firstName, lastName, mobileNumber, email, password } = req.body;

    //check user exits or not
    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.send(
        Services.prepareResponse(HttpStatus.SUCCESS, MSG.USER_ALREADY_EXIST)
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      mobileNumber,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    await sendEmail(email, "signup successfully");

    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "Signup successfully",
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
//user &admin login
exports.login = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send(
        Services.prepareResponse(HttpStatus.NOT_FOUND, MSG.USER_NOT_FOUND, {
          message: "User not found",
        })
      );
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        token,
        message: "Login successfully",
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

//user &admin forget password
exports.forgetPassword = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const { email } = req.body;

    const user = await User.findOne({ email });
    //check user already exit or not
    if (!user) {
      res.send(
        Services.prepareResponse(
          HttpStatus.USER_NOT_FOUND,
          MSG.USER_NOT_FOUND,
          { message: "User not Registration" }
        )
      );
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now();
    await sendEmail(
      email,
      "Password Reset",
      `Use this token to reset your password: ${resetToken}`
    );
    await user.save();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "check your email password",
        resetToken: resetToken,
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
//user & admin update password
exports.updatePassword = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both current and new passwords are required" });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "New password must be at least 8 characters long" });
    }

    // Find user
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(401).json({ error: "User not found" });

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid old password" });

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "Password updated successfully",
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
//admin-get all user
exports.getAllUser = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const user = await User.find({ isDeleted: false });
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        list: user,
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

// delete api(Admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(
      { _id: userId },
      { isDeleted: true }
    );
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "User deleted successfully",
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
