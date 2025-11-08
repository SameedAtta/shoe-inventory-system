const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  boxesSold: { type: Number, required: true, min: 1 },
  salePricePerBox: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  customerName: { type: String, required: true }, // ✅ Add this
}, { timestamps: true });

module.exports = mongoose.models.Sale || mongoose.model("Sale", saleSchema);



