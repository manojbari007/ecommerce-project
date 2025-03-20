const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  couponCode: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["percentage", "flat"],
    required: true,
  },
  status: {
    type: ["active", "inactive"],
    default: "active",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Discount", discountSchema);
