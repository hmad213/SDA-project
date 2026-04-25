const { Router } = require("express");
const productRouter = Router();
const productController = require("../controllers/productController");
const { authenticate } = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorize");

productRouter.get("/:index", productController.getProductIndex);

productRouter.get("/", productController.getProduct);

productRouter.post(
  "/",
  authenticate,
  authorizeMiddleware.authorizeRole("admin", "retailer"),
  productController.postProduct,
);

productRouter.put(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeRetailer("admin"),
  productController.putProduct,
);

productRouter.delete(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeRetailer("admin"),
  productController.deleteProduct,
);

productRouter.get("/search", productController.getProductSearch);

module.exports = {
  productRouter,
};
