const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
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
  status: {
    type: ["active", "inactive"],
    default: "active",
  },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
