const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorize");

userRouter.get(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeUser("admin"),
  userController.getUserIndex,
);

userRouter.get(
  "/",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  userController.getUsers(),
);

userRouter.put(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeUser("admin"),
  userController.putUser,
);

userRouter.delete(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeUser("admin"),
  userController.deleteUser,
);

userRouter.get(
  "/admin",
  authenticate,
  authorizeMiddleware.authorizeUser("admin"),
  userController.getAdmin,
);

userRouter.get(
  "/User",
  authenticate,
  authorizeMiddleware.authorizeUser("admin"),
  userController.getCustomer,
);

userRouter.get(
  "/retailer",
  authenticate,
  authorizeMiddleware.authorizeUser("admin"),
  userController.getRetailer,
);

module.exports = {
  userRouter,
};
