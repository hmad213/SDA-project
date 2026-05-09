const { Router } = require("express");
const productRouter = Router();
const productController = require("../controllers/productController");
const { authenticate } = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorize");

productRouter.get("/search", productController.getProductSearch); // ← moved up
productRouter.get("/", productController.getProduct);
productRouter.get("/:index", productController.getProductIndex);

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

module.exports = {
  productRouter,
};
