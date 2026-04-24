const pool = require("./pool");

//keep in mind that SELECT queries are going to be expensive so instead limit them to a small number
//Also products are dependent upon the page that the user is on which is the offset variable

async function getProducts({ limit, offset }) {
  let query = "SELECT * FROM Products";
  let arr = [];
  if (limit) {
    query.concat(" LIMIT $1");
    arr.push(limit);
  }

  if (offset) {
    query.concat(" OFFSET $2");
    arr.push(offset);
  }

  const { rows } = await pool.query(query, arr);
  return rows;
}

async function getProduct(id) {
  const { rows } = await pool.query(
    "SELECT * FROM Products WHERE product_id = $1",
    [id],
  );
  return rows[0];
}

async function insertProduct({
  name,
  price,
  description,
  rating,
  category_id,
  retailer_id,
}) {
  const { rows } = await pool.query(
    "INSERT INTO Products(product_name, price, description, rating, category_id, retailer_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, price, description, rating, category_id, retailer_id],
  );

  return rows[0];
}

//ILIKE is case insensitive
async function searchProductByQuery(query) {
  const { rows } = await pool.query(
    "SELECT * FROM Products WHERE product_name ILIKE $1 OR description ILIKE $1",
    [`%${query}%`],
  );
  return rows;
}

async function searchProductByCategory(category) {
  const { rows } = await pool.query(
    "SELECT * FROM Products WHERE category_id = $1",
    [category],
  );
  return rows;
}

async function updateProduct(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return;

  const setClause = keys
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(", ");

  const values = Object.values(fields);
  values.push(id);

  const query = `UPDATE Products SET ${setClause} WHERE product_id = $${keys.length + 1} RETURNING *`;
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function deleteProduct(name) {
  const query = `DELETE FROM Products WHERE product_name = $1`;
  const { rowCount } = await pool.query(query, [name]);
  return rowCount > 0;
}

module.exports = {
  getProducts,
  insertProduct,
  getProduct,
  updateProduct,
  searchProductByCategory,
  searchProductByQuery,
  deleteProduct,
};
