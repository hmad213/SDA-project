const pool = require("./pool");

async function getOrdersByCustomer(index) {
  const { rows } = await pool.query(
    'SELECT * FROM "orders" WHERE customer_id = $1',
    [index],
  );
  return rows;
}

async function getOrdersByRetailer(retailer_id) {
  const { rows } = await pool.query(
    `SELECT o.order_id, o.customer_id, o.order_date, o.delivery_date,
            od.product_id, od.quantity, od.price
     FROM orders o
     JOIN order_details od ON o.order_id = od.order_id
     JOIN products p ON od.product_id = p.product_id
     WHERE p.retailer_id = $1
     ORDER BY o.order_date DESC`,
    [retailer_id],
  );
  return rows;
}

async function getAllOrders() {
  const { rows } = await pool.query(
    `SELECT * FROM orders ORDER BY order_date DESC`,
  );
  return rows;
}

async function getOrderDetails(order_id) {
  const { rows } = await pool.query(
    `SELECT od.product_id, od.quantity, od.price,
            p.product_name, p.image_url, p.retailer_id
     FROM order_details od
     JOIN products p ON od.product_id = p.product_id
     WHERE od.order_id = $1`,
    [order_id],
  );
  return rows;
}

async function getOrdersByProduct(product_id) {
  const { rows } = await pool.query(
    `SELECT o.order_id, o.customer_id, o.order_date, o.delivery_date,
            od.quantity, od.price
     FROM orders o
     JOIN order_details od ON o.order_id = od.order_id
     WHERE od.product_id = $1
     ORDER BY o.order_date DESC`,
    [product_id],
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

async function insertOrder({ customer_id, order_date, delivery_date, cart }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // insert into orders first to get order_id
    const { rows } = await client.query(
      `INSERT INTO orders (customer_id, order_date, delivery_date) 
       VALUES ($1, $2, $3) RETURNING order_id`,
      [customer_id, order_date, delivery_date],
    );

    const order_id = rows[0].order_id;

    // insert each cart item into order_details
    for (const item of cart) {
      await client.query(
        `INSERT INTO order_details (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4)`,
        [order_id, item.product_id, item.quantity, item.price],
      );
    }

    await client.query("COMMIT");
    return order_id;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function updateOrder(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return;

  const setString = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(fields);
  values.push(id);

  const query = `UPDATE "orders" SET ${setString} WHERE order_id = $${values.length} RETURNING *`;
  let rows = await pool.query(query, values);
  return rows[0];
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
  getAllOrders,
  getOrderDetails,
  getOrdersByProduct,
  getOrdersByRetailer,
};
