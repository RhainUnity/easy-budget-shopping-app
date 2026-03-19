// routes/items.js - Protected routes for shopping items

const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  updateItem,
} = require("../controllers/items");
const {
  validateCreateItem,
  validateItemId,
  validateUpdateItem,
} = require("../middlewares/validation");

router.get("/", auth, getItems);
router.post("/", auth, validateCreateItem, createItem);
router.delete("/:itemId", auth, validateItemId, deleteItem);
router.patch("/:itemId", auth, validateItemId, validateUpdateItem, updateItem);

module.exports = router;
