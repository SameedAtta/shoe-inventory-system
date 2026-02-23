const Sale = require("../models/sale");
const Product = require("../models/product");
const sendEmail = require("../utils/email");

// ✅ Create Sale (unchanged)
exports.createSale = async (req, res) => {
  try {
    let { productId, boxesSold, customSalePrice, customerName, saleDate } = req.body;
    boxesSold = Number(boxesSold);

    if (!productId || !boxesSold || boxesSold <= 0) {
      return res.status(400).json({ error: "productId and boxesSold (positive) are required" });
    }
    if (!customerName || customerName.trim() === "") {
      return res.status(400).json({ error: "customerName is required" });
    }
    const product = await Product.findById(productId).populate("company", "name");
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.quantity < boxesSold) return res.status(400).json({ error: "Not enough stock available" });

    const salePricePerBox = (customSalePrice != null && !isNaN(Number(customSalePrice)))
      ? Number(customSalePrice)
      : Number(product.salePricePerBox);

    if (!salePricePerBox || isNaN(salePricePerBox)) {
      return res.status(400).json({ error: "Sale price per box is missing or invalid" });
    }

    const totalPrice = salePricePerBox * boxesSold;

    // Update product stock
    product.quantity -= boxesSold;
    product.sold += boxesSold;
    await product.save();
    let validSaleDate = new Date();

    if (saleDate) {
      // Try direct parse
      const parsed = new Date(saleDate);
      if (!isNaN(parsed.getTime())) {
        validSaleDate = parsed; // works with ISO format like "2025-10-04T19:00:00.000Z"
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(saleDate)) {
        // Fallback for plain date input (no timezone)
        const [year, month, day] = saleDate.split("-").map(Number);
        validSaleDate = new Date(Date.UTC(year, month - 1, day, 5, 0, 0)); // adjust for UTC+5
      }
    }

    // Create sale record
    const sale = new Sale({
      product: product._id,
      company: product.company._id,
      boxesSold,
      salePricePerBox,
      totalPrice,
      saleDate: validSaleDate,
      customerName,
    });

    await sale.save();

    // Low stock warning
    let warning = null;
    const LOW_STOCK_THRESHOLD = Number(process.env.LOW_STOCK_THRESHOLD || 5);

    if (product.quantity <= LOW_STOCK_THRESHOLD) {
      warning = `Low stock alert: Only ${product.quantity} boxes left of "${product.name}"`;
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL || "admin@example.com",
          subject: `Low Stock Alert: ${product.name}`,
          text: warning,
          html: `<p>${warning}</p>`,
        });
      } catch (emailErr) {
        console.error("Low stock email failed:", emailErr.message);
      }
    }

    res.status(201).json({
      message: "Sale recorded successfully",
      sale,
      updatedProduct: product,
      warning,
    });
  } catch (err) {
    console.error("createSale error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getSales = async (req, res) => {
  try {
    const { customerName, date } = req.query;
    const filter = {};

    if (customerName) {
      filter.customerName = { $regex: customerName, $options: "i" }; // case-insensitive
    }

    if (date) {
      const [year, month, day] = date.split("-").map(Number);
      const start = new Date(year, month - 1, day, 0, 0, 0);
      const end = new Date(year, month - 1, day + 1, 0, 0, 0);
      filter.saleDate = { $gte: start, $lt: end };
    }

    const sales = await Sale.find(filter)
      .populate({ path: "product", select: "name salePricePerBox" })
      .populate({ path: "company", select: "name" })
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Delete Sale and Restore Stock
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ error: "Sale not found" });

    // Find related product
    const product = await Product.findById(sale.product);
    if (!product) return res.status(404).json({ error: "Related product not found" });

    // Restore stock
    product.quantity += sale.boxesSold;
    product.sold -= sale.boxesSold;

    // ✅ Ensure required fields stay intact
    if (!product.companyId && sale.company) {
      product.companyId = sale.company; // set from sale record if missing
    }

    await product.save({ validateBeforeSave: true });

    // Delete sale record
    await Sale.findByIdAndDelete(req.params.id);

    res.json({ message: "Sale deleted and stock restored successfully" });
  } catch (err) {
    console.error("deleteSale error:", err);
    res.status(500).json({ error: err.message });
  }
};



