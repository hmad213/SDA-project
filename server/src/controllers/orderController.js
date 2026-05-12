const orderQueries = require("../db/order_queries");

const getAllOrders = async (req, res) => {
  try {
    const result = await orderQueries.getAllOrders();
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getOrderByIndex = async (req, res) => {
  const index = Number(req.params.index);
  console.log("getOrdersByIndex called with index:", index);  // j
  console.log("req.user:", req.user);                         // j

  if (Number.isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  try {
    const result = await orderQueries.getOrderById(index);
    console.log("query result:", result);                    // 👈
    if (!result.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (req.user.role === "customer" && result[0].customer_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error("DB error:", error); // 👈
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

const getOrdersByCustomer = async (req, res) => {
  const index = Number(req.params.index);

  if (Number.isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  try {
    const result = await orderQueries.getOrdersByCustomer(index);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getOrdersByRetailer = async (req, res) => {
  const index = Number(req.params.index);

  if (Number.isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  try {
    const result = await orderQueries.getOrdersByRetailer(index);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getOrdersByProduct = async (req, res) => {
  const index = Number(req.params.index);

  if (Number.isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  try {
    const result = await orderQueries.getOrdersByProduct(index);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const postOrder = async (req, res) => {
  const { vehicle_id } = req.body;      
  const customer_id = req.user?.id;

  if (!customer_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!vehicle_id) {
    return res.status(400).json({ error: "vehicle_id is required" });
  }

  const purchase_date = new Date().toISOString().split("T")[0];

  try {
    const order = await orderQueries.insertOrder({
      customer_id,
      purchase_date,
      vehicle_id,
    });
    res.status(201).json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const updateOrder = async (req, res) => {
  const index = Number(req.params.index);

  if (Number.isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  const fields = ["order_date", "delivery_date"];
  const inputObj = {};

  for (const field of fields) {
    if (req.body[field]) {
      inputObj[field] = req.body[field];
    }
  }

  if (Object.keys(inputObj).length === 0) {
    return res.status(400).json({ error: "No valid fields provided" });
  }

  try {
    const result = await orderQueries.updateOrder(index, inputObj);
    if (!result) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

const deleteOrder = async (req, res) => {
  const index = Number(req.params.index);

  if (Number.isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  try {
    await orderQueries.deleteOrder(index);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

module.exports = {
  getAllOrders,
  getOrderByIndex,
  getOrdersByCustomer,
  getOrdersByRetailer,
  getOrdersByProduct,
  postOrder,
  updateOrder,
  deleteOrder,
};
