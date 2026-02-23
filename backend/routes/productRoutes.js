const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Add new shoe
router.post("/", productController.addProduct);

// Get all shoes
router.get("/", productController.getProducts);

router.get("/company/:companyId", productController.getProductsByCompany);
// Sale a shoe
router.post("/sale", productController.sellProduct);
router.patch("/add-stock/:productId", productController.addStock);
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

module.exports = router;




// const express = require("express");
// const { addShoe, getShoes, sellShoe } = require("../controllers/shoeController");
// const router = express.Router();

// router.post("/addShoe", addShoe);
// router.get("/getShoe", getShoes);
// router.put("/sell/:id", sellShoe);

// module.exports = router;