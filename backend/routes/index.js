// backend-express/routes/index.js - Main API router

const router = require("express").Router();
const userRoutes = require("./users");
const itemRoutes = require("./items");
const pricingRoutes = require("./pricing");

router.use("/users", userRoutes);
router.use("/items", itemRoutes);
router.use("/pricing", pricingRoutes);

module.exports = router;
