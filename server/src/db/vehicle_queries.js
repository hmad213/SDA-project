const pool = require("./pool");

async function getVehicles({ limit, offset }) {
  let query = "SELECT * FROM vehicle";
  let count = 1;
  let arr = [];

  if (limit) {
    query = query.concat(` LIMIT $${count}`);
    arr.push(limit);
    count++;
  }

  if (offset) {
    query = query.concat(` OFFSET $${count}`);
    arr.push(offset);
  }

  const { rows } = await pool.query(query, arr);
  return rows;
}

async function getVehicle(id) {
  const { rows } = await pool.query(
    "SELECT * FROM vehicle WHERE vehicle_id = $1",
    [id],
  );

  return rows[0];
}

async function insertVehicle({
  type,
  brand_id,
  mileage,
  price,
  retailer_id,
  description,
  image_url,
}) {
  const { rows } = await pool.query(
    `INSERT INTO vehicle
    (type, brand_id, mileage, price, retailer_id, description, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      type,
      brand_id,
      mileage,
      price,
      retailer_id,
      description,
      image_url,
    ],
  );

  return rows[0];
}

// Case-insensitive search using ILIKE
async function searchVehicle({
  search,
  brand_id,
  type,
  limit,
  offset,
}) {
  let query = "SELECT * FROM vehicle";
  let inputArr = [];
  let conditions = [];
  let count = 1;

  if (search) {
    conditions.push(
      `(description ILIKE $${count} OR type ILIKE $${count})`,
    );
    inputArr.push(`%${search}%`);
    count++;
  }

  if (brand_id) {
    conditions.push(`brand_id = $${count}`);
    inputArr.push(brand_id);
    count++;
  }

  if (type) {
    conditions.push(`type ILIKE $${count}`);
    inputArr.push(`%${type}%`);
    count++;
  }

  if (conditions.length > 0) {
    query = query.concat(` WHERE ${conditions.join(" AND ")}`);
  }

  if (limit) {
    query = query.concat(` LIMIT $${count}`);
    inputArr.push(limit);
    count++;
  }

  if (offset) {
    query = query.concat(` OFFSET $${count}`);
    inputArr.push(offset);
  }

  const { rows } = await pool.query(query, inputArr);
  return rows;
}

async function updateVehicle(id, fields) {
  const keys = Object.keys(fields);

  if (keys.length === 0) return;

  const setClause = keys
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(", ");

  const values = Object.values(fields);
  values.push(id);

  const query = `
    UPDATE vehicle
    SET ${setClause}
    WHERE vehicle_id = $${keys.length + 1}
    RETURNING *
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function deleteVehicle(id) {
  const query = `DELETE FROM vehicle WHERE vehicle_id = $1`;

  const { rowCount } = await pool.query(query, [id]);

  return rowCount > 0;
}

async function getVehiclesByRetailer(retailer_id) {
  const { rows } = await pool.query(
    `SELECT * FROM vehicle WHERE retailer_id = $1`,
    [retailer_id],
  );

  return rows;
}

async function getVehiclesByBrand(brand_id) {
  const { rows } = await pool.query(
    `SELECT * FROM vehicle WHERE brand_id = $1`,
    [brand_id],
  );

  return rows;
}

module.exports = {
  getVehicles,
  getVehicle,
  insertVehicle,
  searchVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByRetailer,
  getVehiclesByBrand,
};