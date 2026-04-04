// backend-express/routes/pricing.js

const router = require("express").Router();
const { getAveragePrice, createSharedPrice } = require("../controllers/pricing");

/* router.get("/average-price", getAveragePrice); */

// For debugging - log when this route is hit
router.get(
  "/average-price",
  (req, res, next) => {
    console.log("HIT pricing route");
    next();
  },
  getAveragePrice,
);

router.post("/submit-price", createSharedPrice);

module.exports = router;
