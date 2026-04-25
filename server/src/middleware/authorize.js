const productQueries = require("../db/product_queries");

const authorizeRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };

const authorizeUser =
  (...bypassRoles) =>
  (req, res, next) => {
    if (bypassRoles.length !== 0 && bypassRoles.includes(req.user?.role)) {
      return next();
    }

    const index = parseInt(req.params.index, 10);

    if (isNaN(index)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    if (index !== req.user?.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };

const authorizeRetailer =
  (...bypassRoles) =>
  async (req, res, next) => {
    if (bypassRoles.length !== 0 && bypassRoles.includes(req.user?.role)) {
      return next();
    }

    const { index } = req.params;

    if (isNaN(index)) {
      return res.status(400).json({ error: "Index must be a number" });
    }

    try {
      const result = await productQueries.getProduct(index);
      const retailer_id = result.retailer_id;
      if (Number(retailer_id) !== Number(req.user?.id)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  };

module.exports = {
  authorizeRole,
  authorizeUser,
  authorizeRetailer,
};
