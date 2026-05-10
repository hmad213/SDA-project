const pool = require("./pool");

async function getPendingRequests() {
  const { rows } = await pool.query(
    `SELECT r.request_id, r.user_id, r.status, u.username
     FROM retailer_requests r
     JOIN users u ON r.user_id = u.user_id
     WHERE r.status = 'PENDING'`,
  );
  return rows;
}

async function insertRequest(user_id) {
  const { rows } = await pool.query(
    `INSERT INTO retailer_requests (user_id, status)
     VALUES ($1, 'PENDING')
     RETURNING *`,
    [user_id],
  );
  return rows[0];
}

async function updateRequestStatus(request_id, status) {
  const { rows } = await pool.query(
    `UPDATE retailer_requests SET status = $1
     WHERE request_id = $2
     RETURNING *`,
    [status, request_id],
  );
  return rows[0];
}

async function getRequestByUser(user_id) {
  const { rows } = await pool.query(
    `SELECT * FROM retailer_requests WHERE user_id = $1`,
    [user_id],
  );
  return rows[0];
}

module.exports = {
  getPendingRequests,
  insertRequest,
  updateRequestStatus,
  getRequestByUser,
};
