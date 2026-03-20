// models/sharedPrice.js

const mongoose = require("mongoose");

const sharedPriceSchema = new mongoose.Schema(
  {
    normalizedName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      default: "",
      trim: true,
    },
    store: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "Other",
      enum: [
        "Pantry",
        "Dairy",
        "Meat",
        "Frozen",
        "Produce",
        "Bakery",
        "Beverages",
        "Snacks",
        "Household",
        "Personal Care",
        "Canned Goods",
        "Condiments",
        "Other",
      ],
    },
    unit: {
      type: String,
      required: true,
      trim: true,
      default: "each",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    sourceType: {
      type: String,
      default: "seed",
      enum: ["seed", "submission", "promoted"],
    },
    submissionCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    aliases: {
      type: [String],
      default: [],
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  { timestamps: true },
);

sharedPriceSchema.index({ normalizedName: 1, store: 1 });

module.exports = mongoose.model("sharedPrice", sharedPriceSchema);
