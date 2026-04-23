const { Router } = require("express");
const categoryRouter = Router();
const categoryController = require("../controllers/categoryController");

categoryRouter.get("/", categoryController.getCategories);
categoryRouter.get("/:index", categoryController.getCategoryIndex);
categoryRouter.post("/", categoryController.postCategory);
categoryRouter.put("/:index", categoryController.putCategory);
categoryRouter.delete("/:index", categoryController.deleteCategory);

module.exports = {
  categoryRouter,
};
