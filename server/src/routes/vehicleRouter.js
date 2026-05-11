const { Router } = require("express");
const vehicleRouter = Router();
const vehicleController = require("../controllers/vehicleController");
const { authenticate } = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorize");

vehicleRouter.get("/search", vehicleController.getVehicleSearch);
vehicleRouter.get(
  "/retailer/:index",
  authenticate,
  authorizeMiddleware.authorizeRole("retailer", "admin"),
  vehicleController.getVehiclesByRetailer,
);
vehicleRouter.get("/", vehicleController.getVehicle);
vehicleRouter.get("/:index", vehicleController.getVehicleIndex);

vehicleRouter.post(
  "/",
  authenticate,
  authorizeMiddleware.authorizeRole("admin", "retailer"),
  vehicleController.postVehicle,
);

vehicleRouter.put(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeRetailer("admin"),
  vehicleController.putVehicle,
);

vehicleRouter.delete(
  "/:index",
  authenticate,
  authorizeMiddleware.authorizeRetailer("admin"),
  vehicleController.deleteVehicle,
);

module.exports = {
  vehicleRouter,
};
