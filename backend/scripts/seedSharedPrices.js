// backend/scripts/seedSharedPrices.js

require("dotenv").config();

const mongoose = require("mongoose");
const SharedPrice = require("../models/sharedPrice");
const sharedPrices = require("../seeds/sharedPrices");

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/shopping_db";

async function seedSharedPrices() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    await SharedPrice.deleteMany({});
    console.log("Cleared existing shared prices");

    await SharedPrice.insertMany(sharedPrices);
    console.log(`Inserted ${sharedPrices.length} shared prices`);

    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedSharedPrices();
