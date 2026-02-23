const Product = require("../models/product");

// Add product (keeps existing behaviour)
exports.addProduct = async (req, res) => {
  try {
    const {
      companyId,
      name,
      type,
      color,
      size,
      costPricePerBox,
      salePricePerBox,
      quantity,
      manufactureDate,
    } = req.body;

    if (!companyId || !name || costPricePerBox == null || salePricePerBox == null || quantity == null) {
      return res.status(400).json({
        error: "companyId, name, costPricePerBox, salePricePerBox, and quantity are required",
      });
    }

    const product = new Product({
      company: companyId,
      name,
      type,
      color,
      size,
      costPricePerBox,
      salePricePerBox,
      quantity,
      manufactureDate,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { company } = req.query; // ?company=companyId
    let filter = {};

    if (company) {
      filter.company = company; // filter by companyId
    }

    const products = await Product.find(filter).populate("company", "name");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
exports.getProductsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const products = await Product.find({ company: companyId });
    if (!products || products.length === 0) {
      return res.status(200).json([]);
    }
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by company:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantityToAdd } = req.body;

    if (!quantityToAdd || quantityToAdd <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.quantity += quantityToAdd;
    await product.save({ validateBeforeSave: false });
    res.json({
      message: "Stock added successfully",
      updatedStock: product.quantity,
      product,
    });
  } catch (err) {
    console.error("Error adding stock:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sellProduct = async (req, res) => {
  try {
    const { productId, boxesSold, salePricePerBox } = req.body;
    if (!productId || !boxesSold) return res.status(400).json({ error: "productId and boxesSold required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.quantity < boxesSold) return res.status(400).json({ error: "Not enough stock" });

    product.quantity -= boxesSold;
    product.sold += boxesSold;
    await product.save();

    return res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


