const pool = require("./pool");

async function getOrdersByCustomer(index) {
  const { rows } = await pool.query(
    'SELECT * FROM "orders" WHERE customer_id = $1',
    [index],
  );
  return rows;
}

async function getOrdersByIndex(index) {
  try {
    const query = `
      SELECT o.order_id, o.customer_id, o.order_date, o.delivery_date,
             od.product_id, od.quantity, od.price as detail_price
      FROM "orders" o
      LEFT JOIN Order_details od ON o.order_id = od.order_id
      WHERE o.order_id = $1
    `;
    const { rows } = await pool.query(query, [index]);
    return rows;
  } catch (error) {
    console.error("Error fetching order by index:", error);
    throw error;
  }
}

async function insertOrder({ customer_id, order_date, delivery_date }) {
  const { rows } = await pool.query(
    'INSERT INTO "orders" (customer_id, order_date, delivery_date) VALUES ($1, $2, $3) RETURNING order_id',
    [customer_id, order_date, delivery_date],
  );
  return rows[0].order_id;
}

async function updateOrder(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return;

  const setString = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(fields);
  values.push(id);

  const query = `UPDATE "orders" SET ${setString} WHERE order_id = $${values.length}`;
  await pool.query(query, values);
}

async function deleteOrder(id) {
  await pool.query('DELETE FROM "orders" WHERE order_id = $1', [id]);
}

module.exports = {
  insertOrder,
  getOrdersByCustomer,
  getOrdersByIndex,
  updateOrder,
  deleteOrder,
};
