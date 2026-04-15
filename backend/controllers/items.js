// controllers/items.js - Controllers for shopping items

const mongoose = require("mongoose");
const Item = require("../models/item");
const { CREATED, ERROR_MESSAGES } = require("../utils/constants");
const normalizeItemName = require("../utils/normalizeItemName");
const normalizeBrandName = require("../utils/normalizeBrandName");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  Item.find({ owner: req.user._id })
    .then((items) => {
      res.send(items);
    })
    .catch(next);
};

const createItem = (req, res, next) => {
  const { item, brand, price, unit, category, priority, qty, hidden, store } =
    req.body;

  const normalizedItem = normalizeItemName(item);
  const normalizedBrand = normalizeBrandName(brand);

  Item.findOne({
    owner: req.user._id,
    store,
  })
    .then((existingItem) => {
      if (!existingItem) {
        return Item.create({
          item,
          brand,
          price,
          unit,
          category,
          priority,
          qty,
          hidden,
          store,
          owner: req.user._id,
        });
      }

      return Item.find({
        owner: req.user._id,
        store,
      }).then((items) => {
        const duplicate = items.find((entry) => {
          const sameItem = normalizeItemName(entry.item) === normalizedItem;

          const sameBrand =
            normalizeBrandName(entry.brand || "") === normalizedBrand;

          return sameItem && sameBrand;
        });

        if (duplicate) {
          throw new ConflictError("That item already exists in this store.");
        }

        return Item.create({
          item,
          brand,
          price,
          unit,
          category,
          priority,
          qty,
          hidden,
          store,
          owner: req.user._id,
        });
      });
    })
    .then((createdItem) => {
      res.status(CREATED).send(createdItem);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_DATA));
        return;
      }

      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        next(new NotFoundError(ERROR_MESSAGES.ITEM_NOT_FOUND));
        return null;
      }

      if (item.owner.toString() !== req.user._id) {
        next(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN_DELETE));
        return null;
      }

      return Item.findByIdAndDelete(itemId).then(() => {
        res.send(item);
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
        return;
      }

      next(err);
    });
};

const updateItem = (req, res, next) => {
  Item.findById(req.params.itemId)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.ITEM_NOT_FOUND))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN_DELETE);
      }

      return Item.findByIdAndUpdate(req.params.itemId, req.body, {
        returnDocument: "after",
        runValidators: true,
      });
    })
    .then((updatedItem) => {
      res.send(updatedItem);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
        return;
      }
      next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  updateItem,
};
