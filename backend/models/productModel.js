const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
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

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

productSchema.pre("save", function (next) {
  if (this.price < 0) {
    return next(new error("Price cannot be negative"));
  }
  if (this.quantity < 0) {
    return next(new error1("Quantity cannot be negative"));
  }
  next();
});

module.exports = Product = mongoose.model("Product", productSchema);
