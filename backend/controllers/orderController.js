const Order = require("../models/orderModel");
const { HttpStatus, ErrorCode } = require("../services/error");
const MSG = require("../services/message");
const Services = require("../services/validator");
const send = Services.sendResponse;
//user: add/place order
exports.addOrder = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const {
      userId,
      productId,
      userAddressId,
      quantity,
      couponCode,
      totalAmount,
      paymentType,
    } = req.body;
    const newOrder = new Order({
      userId,
      productId,
      userAddressId,
      quantity,
      couponCode,
      totalAmount,
      paymentType,
    });
    const savedOrder = await newOrder.save();
    const populateOrder = await Order.find({ _id: savedOrder._id })
      .populate("userId", "firstName lastName mobileNumber")
      .populate("productId", "name image description quantity price")
      .populate(
        "userAddressId",
        "houseNo area type landmark pinCode city state"
      )
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        addOrder: populateOrder,
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

//update order status(admin only)
exports.updateOrder = async (req, res) => {
  try {
    const { paymentStatus, orderStatus, shippingStatus } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { paymentStatus, orderStatus, shippingStatus, updateAt: Date.now() }
    );
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        updatedOrder: updatedOrder,
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
//user:delete api
exports.deleteOrder = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const orderId = req.params.id;
    const canceledOrder = await Order.findByIdAndDelete(
      { _id: orderId },
      { isDeleted: true }
    );

    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        message: "Order canceled successfully",
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
// details of specific  order details(Admin only)
exports.getOrderDetails = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const orderId = req.params.id;
    const orders = await Order.findById({ _id: orderId })
      .populate("userId", "firstName lastName mobileNumber")
      .populate("productId", "name image description quantity price")
      .populate(
        "userAddressId",
        "houseNo area type landmark pinCode city state"
      )
      .exec();
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        orders: orders,
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

// Get all orders (Admin only)
exports.orderList = async (req, res) => {
  try {
    if (Services.hasValidatorErrors(req, res)) {
      return;
    }
    const orders = await Order.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $unwind: {
          path: "$userId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productId",
        },
      },
      {
        $unwind: {
          path: "$productId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "useraddresses",
          localField: "userAddressId",
          foreignField: "_id",
          as: "userAddressId",
        },
      },
      {
        $unwind: {
          path: "$userAddressId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          "userId._id": 1,
          "userId.firstName": 1,
          "userId.lastName": 1,
          "userId.mobileNumber": 1,
          "productId._id": 1,
          "productId._name": 1,
          "productId._image": 1,
          "productId._description": 1,
          "productId._price": 1,
          "userAddressId._id": 1,
          "userAddressId.houseNo": 1,
          "userAddressId.area": 1,
          "userAddressId.landmark": 1,
          "userAddressId.pinCode": 1,
          "userAddressId.city": 1,
          "userAddressId.state": 1,
          quantity: 1,
          couponCode: 1,
          totalAmount: 1,
        },
      },
    ]);
    res.send(
      Services.prepareResponse(HttpStatus.SUCCESS, MSG.SUCCESS, {
        orders: orders,
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
