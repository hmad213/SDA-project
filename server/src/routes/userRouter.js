const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorize");

// specific routes first
userRouter.get(
  "/admin",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  userController.getAdmin,
);

userRouter.get(
  "/customer",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  userController.getCustomer,
);

userRouter.get(
  "/retailer",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  userController.getRetailer,
);

userRouter.get(
  "/",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  userController.getUsers,
);

// dynamic routes last
userRouter.get(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeUser("admin"),
  userController.getUserIndex,
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

module.exports = {
  userRouter,
};
