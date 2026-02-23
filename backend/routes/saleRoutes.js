const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");

// ➡️ Get all sales
router.get("/", saleController.getSales);

// ➡️ Record a new sale
router.post("/", saleController.createSale);
// ➡️ Delete a sale by ID
router.delete("/:id", saleController.deleteSale);

module.exports = router;