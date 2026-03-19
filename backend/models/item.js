// models/item.js - Mongoose schema and model for shopping items

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      default: "each",
    },
    category: {
      type: String,
      required: true,
      enum: ["Pantry", "Dairy", "Meat"],
      default: "Pantry",
    },
    priority: {
      type: String,
      required: true,
      enum: ["Essential", "Surplus", "Optional"],
      default: "Essential",
    },
    qty: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    hidden: {
      type: Boolean,
      required: true,
      default: false,
    },
    store: {
      type: String,
      required: true,
      enum: ["WinCo", "Safeway", "Albertson's"],
      default: "Safeway",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("item", itemSchema);
