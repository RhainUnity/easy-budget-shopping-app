// controllers/users.js - User controllers for signup and signin

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { CREATED, ERROR_MESSAGES } = require("../utils/constants");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/errors");

const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      }),
    )
    .then((user) => {
      res.status(CREATED).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(ERROR_MESSAGES.INVALID_USER_DATA));
        return;
      }

      if (err.code === 11000) {
        next(new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS));
        return;
      }

      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      if (err.message === ERROR_MESSAGES.INCORRECT_AUTH) {
        next(new UnauthorizedError(ERROR_MESSAGES.INCORRECT_AUTH));
        return;
      }

      next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
  const { avatarUrl } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl: avatarUrl || "" },
    { returnDocument: "after", runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
        return;
      }

      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(ERROR_MESSAGES.INVALID_USER_DATA));
        return;
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
        return;
      }

      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
