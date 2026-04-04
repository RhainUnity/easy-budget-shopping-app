// backend/controllers/pricing.js

const SharedPrice = require("../models/sharedPrice");
const normalizeItemName = require("../utils/normalizeItemName");

const getAveragePrice = async (req, res, next) => {
  try {
    const { query, store } = req.query;

    if (!query) {
      return res.status(400).send({ message: "Query is required" });
    }

    const normalizedName = normalizeItemName(query);

    const match = await SharedPrice.findOne({
      normalizedName,
      ...(store ? { store } : {}),
    });

    if (!match) {
      return res.send({
        found: false,
        message: "No match found",
      });
    }

    return res.send({
      found: true,
      item: {
        name: match.displayName,
        brand: match.brand,
        store: match.store,
        category: match.category,
        price: match.price,
        unit: match.unit,
      },
      source: "shared-db",
    });
  } catch (err) {
    next(err);
  }
};

const createSharedPrice = async (req, res, next) => {
  try {
    const { name, brand, store, category, price, unit } = req.body;

    if (!name || !store || !category || price === undefined || price === null) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const normalizedName = normalizeItemName(name);

    const newItem = await SharedPrice.create({
      normalizedName,
      displayName: name,
      brand: brand || "",
      store,
      category,
      price,
      unit: unit || "each",
      sourceType: "submission",
      submissionCount: 1,
      aliases: [],
    });

    return res.status(201).send({ item: newItem });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAveragePrice,
  createSharedPrice,
};
