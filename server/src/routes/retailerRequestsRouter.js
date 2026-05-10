const { Router } = require("express");
const requestRouter = Router();
const requestController = require("../controllers/retailerRequestController");
const { authenticate } = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorize");

requestRouter.post(
  "/",
  authenticate,
  authorizeMiddleware.authorizeRole("customer"),
  requestController.submitRequest,
);

requestRouter.get(
  "/pending",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  requestController.getPendingRequests,
);

requestRouter.put(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  requestController.updateRequestStatus,
);

requestRouter.get(
  "/me",
  authenticate,
  authorizeMiddleware.authorizeRole("customer"),
  requestController.getMyRequest,
);

module.exports = {
  requestRouter,
};
