const brandQueries = require("../db/brand_queries");

const getBrands = async (req, res) => {
  try {
    const rows = await brandQueries.getAllBrands();
    res.status(200).json({ rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
};

const getBrandIndex = async (req, res) => {
  try {
    const { index } = req.params;
    if (isNaN(index)) {
      return res.status(400).json({ error: "Index must be a number" });
    }
    const numberIndex = Number(index);
    const result = await brandQueries.getBrand(numberIndex);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch brand" });
  }
};

const postBrand = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name must not be empty" });
  }
  try {
    const result = await brandQueries.insertBrand({ brand_name: name });
    res.status(201).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to post brand" });
  }
};

const deleteBrand = async (req, res) => {
  const { index } = req.params;
  if (isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }
  const numberIndex = Number(index);
  try {
    await brandQueries.deleteBrand(numberIndex);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete brand" });
  }
};

const putBrand = async (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name must not be empty" });
  }
  if (isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }
  const numberIndex = Number(index);
  try {
    const result = await brandQueries.updateBrand(numberIndex, { brand_name: name });
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update brand" });
  }
};

module.exports = {
  getBrands,
  getBrandIndex,
  postBrand,
  deleteBrand,
  putBrand,
};