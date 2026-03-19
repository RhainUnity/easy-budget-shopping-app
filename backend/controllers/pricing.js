// backend-express/controllers/pricing.js

const { resolveSeriesId } = require("../utils/blsSeriesMap");
const { fetchBlsSeries } = require("../utils/blsApi");

const cache = new Map();

async function getAveragePrice(req, res, next) {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).send({ message: "Query is required" });
    }

    const match = resolveSeriesId(query);

    if (!match) {
      return res.status(404).send({ message: "No BLS mapping found for item" });
    }

    const key = match.key;

    if (cache.has(key)) {
      console.log("Cache hit for", key);
      return res.send(cache.get(key));
    }

    console.log("Cache miss for", key, "- fetching from BLS API");

    const blsData = await fetchBlsSeries(match.seriesId);

    const result = {
      item: match.key,
      label: match.label || match.key,
      seriesId: match.seriesId,
      unit: match.unit,
      ...blsData,
    };

    cache.set(match.key, result);

    return res.send(result);
  } catch (err) {
    console.error("Pricing route error for query:", req.query?.query, err);
    return next(err);
  }
}

module.exports = {
  getAveragePrice,
};
