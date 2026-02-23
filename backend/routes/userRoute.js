const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Signup
router.post("/signup", userController.registerUser);

// Login
router.post("/login", userController.loginUser);

// Get all users
router.get("/", userController.getAllUser);

module.exports = router;