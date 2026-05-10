const { Router } = require("express");
const orderRouter = Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorize");

orderRouter.get(
  "/customer/:index",
  authenticate,
  authorizeMiddleware.authorizeUser("admin"),
  orderController.getOrdersByCustomer,
);

orderRouter.get(
  "/retailer/:index",
  authenticate,
  authorizeMiddleware.authorizeRole("retailer", "admin"),
  orderController.getOrdersByRetailer,
);

orderRouter.get(
  "/product/:index",
  authenticate,
  authorizeMiddleware.authorizeRole("retailer", "admin"),
  orderController.getOrdersByProduct,
);

orderRouter.get(
  "/",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  orderController.getAllOrders,
);

orderRouter.get(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeRole("admin", "customer", "retailer"),
  orderController.getOrdersByIndex,
);

orderRouter.post(
  "/",
  authenticate,
  authorizeMiddleware.authorizeRole("customer", "admin"),
  orderController.postOrder,
);

orderRouter.put(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeRole("retailer", "admin"),
  orderController.updateOrder,
);

orderRouter.delete(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeUser("admin"),
  orderController.deleteOrder,
);

module.exports = {
  orderRouter,
};
