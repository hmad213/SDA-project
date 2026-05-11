const vehicleQueries = require("../db/vehicle_queries");

const getVehicleIndex = async (req, res) => {
  const { index } = req.params;

  if (isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  const indexNumber = Number(index);
  try {
    const result = await vehicleQueries.getVehicle(indexNumber);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch vehicle" });
  }
};

const getVehicles = async (req, res) => {
  const limit = Number(req.query.limit);
  const offset = Number(req.query.offset);

  if ((limit && isNaN(limit)) || (offset && isNaN(offset))) {
    return res.status(400).json({ error: "Limit and Offset must be a number" });
  }

  const inputObj = {};
  if (limit) inputObj.limit = limit;
  if (offset) inputObj.offset = offset;

  try {
    const result = await vehicleQueries.getVehicles(inputObj);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

const postVehicle = async (req, res) => {
  const fields = [
    "type",
    "brand_id",
    "mileage",
    "price",
    "retailer_id",
    "description",
    "image_url",
  ];

  for (let field of fields) {
    if (
      req.body[field] === undefined ||
      req.body[field] === null ||
      req.body[field] === ""
    ) {
      return res.status(400).json({ error: `${field} must not be empty` });
    }
  }

  const { type, brand_id, mileage, price, retailer_id, description, image_url } = req.body;

  if (isNaN(brand_id)) {
    return res.status(400).json({ error: "brand_id must be a number" });
  }

  if (isNaN(mileage)) {
    return res.status(400).json({ error: "Mileage must be a number" });
  }

  if (isNaN(price)) {
    return res.status(400).json({ error: "Price must be a number" });
  }

  if (isNaN(retailer_id)) {
    return res.status(400).json({ error: "retailer_id must be a number" });
  }

  try {
    const result = await vehicleQueries.insertVehicle({
      type,
      brand_id,
      mileage,
      price,
      retailer_id,
      description,
      image_url,
    });
    res.status(201).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert vehicle" });
  }
};

const putVehicle = async (req, res) => {
  const index = Number(req.params.index);
  const fields = ["type", "brand_id", "mileage", "price", "description", "image_url"];

  if (isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  const inputObj = {};
  for (let field of fields) {
    if (req.body[field]) {
      inputObj[field] = req.body[field];
    }
  }

  if (inputObj.brand_id && isNaN(inputObj.brand_id)) {
    return res.status(400).json({ error: "brand_id must be a number" });
  }

  if (inputObj.mileage && isNaN(inputObj.mileage)) {
    return res.status(400).json({ error: "Mileage must be a number" });
  }

  if (inputObj.price && isNaN(inputObj.price)) {
    return res.status(400).json({ error: "Price must be a number" });
  }

  try {
    const result = await vehicleQueries.updateVehicle(index, inputObj);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update vehicle" });
  }
};

const deleteVehicle = async (req, res) => {
  const { index } = req.params;

  if (isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  try {
    await vehicleQueries.deleteVehicle(index);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
};

const getVehicleSearch = async (req, res) => {
  const { limit, offset, search, brand_id, type } = req.query;

  if (limit && isNaN(Number(limit))) {
    return res.status(400).json({ error: "Limit must be a number" });
  }
  if (offset && isNaN(Number(offset))) {
    return res.status(400).json({ error: "Offset must be a number" });
  }
  if (brand_id && isNaN(Number(brand_id))) {
    return res.status(400).json({ error: "brand_id must be a number" });
  }

  const inputObj = {};
  if (search) inputObj.search = search;
  if (type) inputObj.type = type;
  if (brand_id) inputObj.brand_id = Number(brand_id);
  if (limit) inputObj.limit = Number(limit);
  if (offset !== undefined) inputObj.offset = Number(offset);

  try {
    const result = await vehicleQueries.searchVehicle(inputObj);
    res.status(200).json({ result });
  } catch (error) {
    console.error("DB error:", error.message);
    res.status(500).json({ error: "Failed to fetch vehicles on search request" });
  }
};

const getVehiclesByRetailer = async (req, res) => {
  const index = Number(req.params.index);

  if (Number.isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  try {
    const result = await vehicleQueries.getVehiclesByRetailer(index);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

const getVehiclesByBrand = async (req, res) => {
  const index = Number(req.params.index);

  if (Number.isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }

  try {
    const result = await vehicleQueries.getVehiclesByBrand(index);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch vehicles by brand" });
  }
};

module.exports = {
  getVehicleIndex,
  getVehicles,
  postVehicle,
  putVehicle,
  deleteVehicle,
  getVehicleSearch,
  getVehiclesByRetailer,
  getVehiclesByBrand,
};