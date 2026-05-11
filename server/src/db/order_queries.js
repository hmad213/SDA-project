const pool = require("./pool");

const baseQuery = `
  SELECT
    o.order_id,
    o.customer_id,
    o.purchase_date,

    v.vehicle_id,
    v.type,
    v.brand_id,
    v.mileage,
    v.price,
    v.description,
    v.image_url,
    v.retailer_id

  FROM orders o
  JOIN vehicle v
  ON o.vehicle_id = v.vehicle_id
`;

async function getAllOrders() {
  const { rows } = await pool.query(
    `${baseQuery}
     ORDER BY o.purchase_date DESC`,
  );

  return rows;
}

async function getOrderById(order_id) {
  const { rows } = await pool.query(
    `${baseQuery}
     WHERE o.order_id = $1`,
    [order_id],
  );

  return rows[0];
}

async function getOrdersByCustomer(customer_id) {
  const { rows } = await pool.query(
    `${baseQuery}
     WHERE o.customer_id = $1
     ORDER BY o.purchase_date DESC`,
    [customer_id],
  );

  return rows;
}

async function getOrdersByVehicle(vehicle_id) {
  const { rows } = await pool.query(
    `${baseQuery}
     WHERE v.vehicle_id = $1
     ORDER BY o.purchase_date DESC`,
    [vehicle_id],
  );

  return rows;
}

async function getOrdersByRetailer(retailer_id) {
  const { rows } = await pool.query(
    `${baseQuery}
     WHERE v.retailer_id = $1
     ORDER BY o.purchase_date DESC`,
    [retailer_id],
  );

  return rows;
}

async function insertOrder({
  customer_id,
  purchase_date,
  vehicle_id,
}) {
  const { rows } = await pool.query(
    `INSERT INTO orders
    (customer_id, purchase_date, vehicle_id)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [customer_id, purchase_date, vehicle_id],
  );

  return rows[0];
}

async function updateOrder(id, fields) {
  const keys = Object.keys(fields);

  if (keys.length === 0) return;

  const setClause = keys
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(", ");

  const values = Object.values(fields);
  values.push(id);

  const query = `
    UPDATE orders
    SET ${setClause}
    WHERE order_id = $${keys.length + 1}
    RETURNING *
  `;

  const { rows } = await pool.query(query, values);

  return rows[0];
}

async function deleteOrder(order_id) {
  const { rowCount } = await pool.query(
    `DELETE FROM orders WHERE order_id = $1`,
    [order_id],
  );

  return rowCount > 0;
}

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  getOrdersByVehicle,
  getOrdersByRetailer,
  insertOrder,
  updateOrder,
  deleteOrder,
};