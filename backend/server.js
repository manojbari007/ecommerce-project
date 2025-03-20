const express = require("express");
const connectDatabase = require("./config");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = 3000;
const app = express();

const swaggerDocument = yaml.load(path.join(__dirname, "swagger.yaml"));
// Route to serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static("public"));
app.use(bodyParser.json()); //middleware
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");
connectDatabase(); //connect database

app.use("/user", require("../backend/routes/userRouter"));
app.use("/userProfile", require("../backend/routes/updateProfileRouter"));
app.use("/userAddress", require("../backend/routes/userAddressRouter"));
app.use("/category", require("../backend/routes/categoryRouter"));
app.use("/subCategory", require("../backend/routes/subCategoryRouter"));
app.use("/product", require("../backend/routes/productRouter"));
app.use("/order", require("../backend/routes/orderRouter"));
app.use("/review", require("../backend/routes/reviewRouter"));
app.use("/cart", require("../backend/routes/cartRouter"));
app.use("/discount", require("../backend/routes/discountRouter"));
app.use("/wishlist", require("../backend/routes/wishlistRouter"));

//swagger route

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
