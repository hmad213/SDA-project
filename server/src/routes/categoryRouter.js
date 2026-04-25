const { Router } = require("express");
const categoryRouter = Router();
const categoryController = require("../controllers/categoryController");
const { authenticate } = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorize");

categoryRouter.get("/", categoryController.getCategories);
categoryRouter.get("/:index", categoryController.getCategoryIndex);
categoryRouter.post(
  "/",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  categoryController.postCategory,
);
categoryRouter.put(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  categoryController.putCategory,
);
categoryRouter.delete(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  categoryController.deleteCategory,
);

module.exports = {
  categoryRouter,
};
