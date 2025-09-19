const express = require("express");
const app = express();
//DOTENV
require("dotenv").config();
//DB connection
const dbConnection = require("./config/dbConnection");
//PORT
const port = process.env.PORT || 8081;
//cors
const cors = require("cors");
app.use(cors());
app.use(express.json());
//Route
app.get("/health", (req, res) => res.send("Server is running"));
const authRoute = require("./routes/authRoute");
app.use("/auth",authRoute);
const categoryRoute = require("./routes/categoryRoute");
app.use("/category",categoryRoute);

const productRoute = require("./routes/productRoute");
app.use("/product",productRoute);

const wishlistRoute = require("./routes/wishlistRoute");
app.use("/wishlist",wishlistRoute);
const reviewRoute = require("./routes/reviewRoute");
app.use("/review",reviewRoute);

const orderRoute = require("./routes/orderRoute");
app.use("/order",orderRoute);
const cartRoute = require("./routes/cartRoute");
app.use("/cart",cartRoute);

const addressRoute = require("./routes/addressRoute");
app.use("/address",addressRoute);

dbConnection();
app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
})