const Review = require("../models/reviewModel");
const { HttpStatus, ErrorCode } = require("../services/error");
const MSG = require("../services/message");
const Services = require("../services/validator");
const send = Services.sendResponse;

//user -add review api
exports.addReview = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const { userId, productId, rating, comment } = req.body;
    const review = new Review({
      userId,
      productId,
      rating,
      comment,
      createAt: Date.now(),
    });
    const savedReview = await review.save();
    const populateReview = await Review.find({ _id: savedReview._id })
      .populate("userId", "firstName lastName")
      .populate("productId", "name image description")
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        newReview: populateReview,
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

//admin-delete review api
exports.deleteReview = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const reviewId = req.params.id;
    const reviewDelete = await Review.findByIdAndDelete(
      { _id: reviewId },
      { isDeleted: true }
    );
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "review Deleted successfully",
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

//admin-list api
exports.reviewList = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const review = await Review.find({});

    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        list: review,
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
exports.reviewDetails = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById({ _id: reviewId })
      .populate("userId", "firstName lastName")
      .populate("productId", "name image description")
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        details: review,
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
