const express = require("express");
const cors = require("cors");

const { indexRouter } = require("./routes/indexRouter");
const { vehicleRouter } = require("./routes/vehicleRouter");
const { orderRouter } = require("./routes/orderRouter");
const { brandRouter } = require("./routes/brandRouter");
const { userRouter } = require("./routes/userRouter");
const { authRouter } = require("./routes/authRouter");
const { requestRouter } = require("./routes/retailerRequestsRouter");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/request", requestRouter);
app.use("/", indexRouter);
app.use("/vehicle", vehicleRouter);
app.use("/order", orderRouter);
app.use("/brand", brandRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(
    `Listening on Port ${PORT}! Navigate to http://localhost:${PORT} to run tests.`,
  );
});
