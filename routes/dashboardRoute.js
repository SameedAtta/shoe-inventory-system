const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware"); // 👈 import your JWT middleware

// Dashboard stats (only for logged-in users)
router.get("/stats", authMiddleware, dashboardController.getDashboardStats);

module.exports = router;










// const express = require("express");
// const router = express.Router();
// const dashboardController = require("../controllers/dashboardController");

// // Dashboard stats
// router.get("/stats", dashboardController.getDashboardStats);

// module.exports = router;