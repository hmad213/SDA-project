const pool = require("./pool");

async function getAllBrands() {
  const { rows } = await pool.query(
    "SELECT * FROM vehicle_brand ORDER BY brand_name",
  );
  return rows;
}

async function getBrand(id) {
  const { rows } = await pool.query(
    "SELECT * FROM vehicle_brand WHERE brand_id = $1",
    [id],
  );
  return rows[0];
}

async function insertBrand({ brand_name }) {
  const { rows } = await pool.query(
    "INSERT INTO vehicle_brand (brand_name) VALUES ($1) RETURNING *",
    [brand_name],
  );
  return rows[0];
}

async function updateBrand(id, { brand_name }) {
  const { rows } = await pool.query(
    "UPDATE vehicle_brand SET brand_name = $1 WHERE brand_id = $2 RETURNING *",
    [brand_name, id],
  );
  return rows[0];
}

async function deleteBrand(id) {
  const { rowCount } = await pool.query(
    "DELETE FROM vehicle_brand WHERE brand_id = $1",
    [id],
  );
  return rowCount > 0;
}

module.exports = {
  getAllBrands,
  getBrand,
  insertBrand,
  updateBrand,
  deleteBrand,
};
