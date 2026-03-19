// routes/users.js - User routes

const router = require("express").Router();
const {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateSignup,
  validateSignin,
  validateUpdateUser,
} = require("../middlewares/validation");

router.post("/signup", validateSignup, createUser);
router.post("/signin", validateSignin, login);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUpdateUser, updateCurrentUser);
module.exports = router;
