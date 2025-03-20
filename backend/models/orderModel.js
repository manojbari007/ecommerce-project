const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userAddressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAddress",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  couponCode: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: Number,
    enum: [0, 1, 2], //cod:0,debitCard:1,creditCard:2
    required: true,
  },
  paymentStatus: {
    type: Number,
    enum: [0, 1, 2], //pending:0,success:1,failed:2
    default: 0,
  },
  orderStatus: {
    type: Number,
    enum: [0, 1, 2, 3], //canceled:0,pending:1,inprogress:2,completed:3
    default: 0,
  },
  shippingStatus: {
    type: Number,
    enum: [0, 1, 2], //inprogress:0,dispatch:1,delivered:2
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
});

module.exports = Order = mongoose.model("Order", orderSchema);
