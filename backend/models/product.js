const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  name: { type: String, required: true },
  type: { type: String },
  color: { type: String },
  size: { type: Number },
  quantity: { type: Number, required: true, default: 0 },
  sold: { type: Number, default: 0 },
  costPricePerBox: { type: Number, required: true },
  salePricePerBox: { type: Number, required: true },
  manufactureDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);

