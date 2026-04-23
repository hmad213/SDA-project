const express = require("express");
const cors = require("cors");

const { indexRouter } = require("./routes/indexRouter");
const { productRouter } = require("./routes/productRouter");
const { orderRouter } = require("./routes/orderRouter");
const { categoryRouter } = require("./routes/categoryRouter");
const { userRouter } = require("./routes/userRouter");

const app = express();
const PORT = 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));

app.use("/", indexRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/category", categoryRouter);
app.use("/user", userRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log("Listening on Port " + 3000 + "!");
});
