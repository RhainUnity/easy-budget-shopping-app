// error-handler.js - Express error handling middleware

const { isCelebrateError } = require("celebrate");
const { ERROR_MESSAGES } = require("../utils/constants");

function errorHandler(err, req, res, next) {
  if (isCelebrateError(err)) {
    return res.status(400).send({
      message: "Validation failed",
    });
  }

  const { statusCode = 500, message } = err;

  return res.status(statusCode).send({
    message: statusCode === 500 ? ERROR_MESSAGES.SERVER_ERROR : message,
  });
}

module.exports = errorHandler;
