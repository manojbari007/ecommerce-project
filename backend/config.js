const mongoose = require("mongoose");
const MONGO_URL = "mongodb://localhost:27017/ecommerce";

module.exports = connectDatabase = async () => {
  try {
    mongoose.connect(MONGO_URL).then(() => {
      console.log("mongodb connected");
    });
  } catch (error) {
    console.log("mongodb connection failed", error.message);
  }
};
