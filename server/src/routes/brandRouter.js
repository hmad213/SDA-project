const { Router } = require("express");
const brandRouter = Router();
const brandController = require("../controllers/brandController");
const { authenticate } = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorize");

brandRouter.get("/", brandController.getBrands);
brandRouter.get("/:index", brandController.getBrandIndex);
brandRouter.post(
  "/",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  brandController.postBrand,
);
brandRouter.put(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  brandController.putBrand,
);
brandRouter.delete(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeRole("admin"),
  brandController.deleteBrand,
);

module.exports = {
  brandRouter,
};
