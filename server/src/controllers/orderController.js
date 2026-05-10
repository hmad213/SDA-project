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

const getOrdersByIndex = async (req, res) => {
  const index = Number(req.params.index);

  if (Number.isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  try {
    const result = await orderQueries.getOrdersByIndex(index);
    if (!result.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (req.user.role === "customer" && result[0].customer_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
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
  console.log("req.user:", req.user);
  const { cart } = req.body;
  const customer_id = req.user?.id;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Cart must not be empty" });
  }

  for (const item of cart) {
    if (!item.product_id || !item.quantity || !item.price) {
      return res.status(400).json({
        error: "Each cart item must have product_id, quantity, and price",
      });
    }
    if (
      Number.isNaN(Number(item.product_id)) ||
      Number.isNaN(Number(item.quantity)) ||
      Number.isNaN(Number(item.price))
    ) {
      return res
        .status(400)
        .json({ error: "product_id, quantity, and price must be numbers" });
    }
  }

  const order_date = new Date().toISOString().split("T")[0];

  try {
    const order_id = await orderQueries.insertOrder({
      customer_id,
      order_date,
      delivery_date: null,
      cart,
    });
    res.status(201).json({ order_id });
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
  getOrdersByIndex,
  getOrdersByCustomer,
  getOrdersByRetailer,
  getOrdersByProduct,
  postOrder,
  updateOrder,
  deleteOrder,
};
