// config.js - Configuration module for environment variables

const { NODE_ENV, JWT_SECRET = "dev-secret", MONGO_URL } = process.env;

const DEFAULT_MONGO_URL = "mongodb://127.0.0.1:27017/shopping_db";

module.exports = {
  JWT_SECRET: NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
  MONGO_URL: MONGO_URL || DEFAULT_MONGO_URL,
};
