// constants.js - Module for application constants

const DEFAULT_PORT = 3000;
const CREATED = 201;

const ERROR_MESSAGES = {
  SERVER_ERROR: "An error has occurred on the server",
  INVALID_USER_DATA: "Invalid data provided",
  INVALID_ITEM_DATA: "Invalid item data",
  USER_ALREADY_EXISTS: "A user with that email already exists",
  INCORRECT_AUTH: "Incorrect email or password",
  AUTH_REQUIRED: "Authorization required",
  INVALID_TOKEN: "Invalid or expired token",
  USER_NOT_FOUND: "User not found",
  ITEM_NOT_FOUND: "Item not found",
  FORBIDDEN_DELETE: "You cannot delete another user's item",
  INVALID_ITEM_ID: "Invalid item id",
};

module.exports = {
  DEFAULT_PORT,
  CREATED,
  ERROR_MESSAGES,
};
