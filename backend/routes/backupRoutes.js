// const express = require("express");
// const router = express.Router();
// const { backupDatabase } = require("../controllers/backupController");

// router.post("/", backupDatabase);

// module.exports = router;


// routes/backupRoutes.js
const express = require("express");
const router = express.Router();
const { backupToDrive } = require("../utils/backupHelper");

router.post("/", async (req, res) => {
  console.log("📦 Manual backup triggered...");
  const result = await backupToDrive();
  if (result.success) {
    res.json({ message: "✅ Backup uploaded successfully!", link: result.link });
  } else {
    res.status(500).json({ message: "❌ Backup failed", error: result.error });
  }
});

module.exports = router;
