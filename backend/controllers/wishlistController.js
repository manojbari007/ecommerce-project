const Wishlist = require("../models/wishlistModel");
const { HttpStatus, ErrorCode } = require("../services/error");
const MSG = require("../services/message");
const Services = require("../services/validator");
const send = Services.sendResponse;
//user: post api
exports.addWishlist = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const { userId, productId, status } = req.body;
    const wishlist = new Wishlist({ userId, productId, status });
    const savedWishlist = await wishlist.save();

    const populateWishlist = await Wishlist.findOne({
      _id: savedWishlist._id,
    })
      .populate("userId", "firstName lastName email")
      .populate("productId", "name image description price");

    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        addWishlist: populateWishlist,
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

// user - delete api
exports.deleteWishlist = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const wishlistId = req.params.id;
    const wishlist = await Wishlist.findByIdAndDelete(
      { _id: wishlistId },
      { isDeleted: true }
    );

    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "The Product remove from your wishlist",
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
