const requestQueries = require("../db/retailer_request_queries");
const userQueries = require("../db/user_queries");

const getPendingRequests = async (req, res) => {
  try {
    const result = await requestQueries.getPendingRequests();
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch pending requests" });
  }
};

const submitRequest = async (req, res) => {
  const user_id = req.user?.id;

  try {
    const existing = await requestQueries.getRequestByUser(user_id);
    if (existing) {
      return res.status(409).json({
        error: `You already have a ${existing.status.toLowerCase()} request`,
      });
    }

    const result = await requestQueries.insertRequest(user_id);
    res.status(201).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit request" });
  }
};

const updateRequestStatus = async (req, res) => {
  const index = Number(req.params.index);
  const { status } = req.body;

  if (Number.isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  const validStatuses = ["ACCEPTED", "REJECTED"];
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ error: "Status must be ACCEPTED or REJECTED" });
  }

  try {
    const updatedRequest = await requestQueries.updateRequestStatus(
      index,
      status,
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    // if accepted, update the user's role to retailer (role_id 2)
    if (status === "ACCEPTED") {
      await userQueries.updateUser(updatedRequest.user_id, { role_id: 2 });
    }

    res.status(200).json({ result: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update request status" });
  }
};

const getMyRequest = async (req, res) => {
  const user_id = req.user?.id;

  try {
    const result = await requestQueries.getRequestByUser(user_id);
    if (!result) {
      return res.status(404).json({ error: "No request found" });
    }
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch request" });
  }
};

module.exports = {
  getPendingRequests,
  submitRequest,
  updateRequestStatus,
  getMyRequest,
};
