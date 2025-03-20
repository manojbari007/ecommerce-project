const Cart = require("../models/cartModel");
const { HttpStatus, ErrorCode } = require("../services/error");
const MSG = require("../services/message");
const Services = require("../services/validator");

//user side api
exports.addCart = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const { userId, productId, quantity, price } = req.body;
    const cart = await Cart({
      userId,
      productId,
      quantity,
      price,
    });
    const savedCart = await cart.save();
    const populateCart = await Cart.find({ _id: savedCart._id })
      .populate("userId", "firstName lastName")
      .populate("productId", "name Image description")
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        addCart: populateCart,
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
//update cart
exports.updateCart = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const { id } = req.params;
    const { userId, productId, quantity, price } = req.body;
    const cart = await Cart.findByIdAndUpdate(id, {
      userId,
      productId,
      quantity,
      price,
    });
    const populateCart = await Cart.findByIdAndUpdate({
      _id: cart._id,
      isDeleted: false,
    })
      .populate("userId", "firstName lastName")
      .populate("productId", "name image description")
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        updateCart: populateCart,
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

//delete cart
exports.deleteCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await Cart.findByIdAndDelete(cartId);
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "Product have been removed  from Cart",
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
