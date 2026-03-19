// validation.js - Request validation schemas using celebrate/Joi

const { celebrate, Joi, Segments } = require("celebrate");

const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    item: Joi.string().required().min(1).max(100),
    price: Joi.number().required().min(0),
    unit: Joi.string().required(),
    category: Joi.string().required().valid("Pantry", "Dairy", "Meat"),
    priority: Joi.string().required().valid("Essential", "Surplus", "Optional"),
    qty: Joi.number().min(0),
    hidden: Joi.boolean(),
    store: Joi.string().valid("WinCo", "Safeway", "Albertson's").required(),
  }),
});

const validateItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24),
  }),
});

const validateUpdateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    item: Joi.string().min(1).max(100),
    price: Joi.number().min(0),
    unit: Joi.string(),
    category: Joi.string().valid("Pantry", "Dairy", "Meat"),
    priority: Joi.string().valid("Essential", "Surplus", "Optional"),
    qty: Joi.number().min(0),
    hidden: Joi.boolean(),
    store: Joi.string().valid("WinCo", "Safeway", "Albertson's"),
  }),
});

const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatarUrl: Joi.string().allow("", null),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateCreateItem,
  validateItemId,
  validateUpdateItem,
  validateUpdateUser,
};
