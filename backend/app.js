// app.js - Entry point for shopping app backend

// Load environment variables
require("dotenv").config();

// Log the current environment mode for debugging and sanity checks
console.log(`Starting server in ${process.env.NODE_ENV || "development"} mode`);

// Core dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Validation / error helpers
const { errors } = require("celebrate");

// Application modules
const routes = require("./routes");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");

// Configuration values
const { DEFAULT_PORT } = require("./utils/constants");
const { MONGO_URL } = require("./utils/config");

// Create Express app instance
const app = express();
const PORT = process.env.PORT || DEFAULT_PORT;

// Application-level configuration

// trust first proxy for rate limiting
app.set("trust proxy", 1);

// Security and rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
});

// Global middleware stack
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(requestLogger);

// Health check endpoint for uptime monitoring
app.get("/", (req, res) => {
  res.status(200).send("Shopping API running");
});

// API routes
app.use("/api", routes);

// Error logging and handling middleware
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

// Mongoose configuration
mongoose.set("strictQuery", true);

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// MongoDB connection event listeners
mongoose.connection.on("error", (err) => {
  console.error("MongoDB runtime error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});
