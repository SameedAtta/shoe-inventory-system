import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addQuantity, setAddQuantity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3006/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Open Modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setAddQuantity("");
    setIsModalOpen(true);
  };

  // ✅ Close Modal
  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  // ✅ Handle Add Stock
  const handleAddStock = async () => {
    if (!addQuantity || addQuantity <= 0) return alert("Please enter a valid quantity");

    try {
      setLoading(true);
      const res = await axios.patch(
        `http://localhost:3006/api/products/add-stock/${selectedProduct._id}`,
        { quantityToAdd: Number(addQuantity) }
      );
      setLoading(false);
      closeModal();
      fetchProducts(); // refresh list
      alert(`Stock updated successfully for ${selectedProduct.name}`);
    } catch (err) {
      console.error("Error adding stock:", err);
      setLoading(false);
      alert("Failed to update stock");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📦 Current Stock</h1>

      {/* Grid of Product Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product, i) => (
            <motion.div
              key={product._id}
              className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 border border-gray-100"
              whileHover={{ scale: 1.03 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                🏢 {product.company?.name || "Unknown Company"}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                🎨 Color: {product.color || "—"}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                📏 Size: {product.size || "—"}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                💸 Sale Price: Rs. {product.salePricePerBox}
              </p>
              <div className="mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.quantity === 0
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  In Stock: {product.quantity}
                </span>
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={() => openModal(product)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all"
                >
                  ➕ Add Stock
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 text-lg">No products found.</p>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full rounded-2xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-2xl font-semibold mb-3 text-gray-800">
              Add Stock
            </Dialog.Title>
            {selectedProduct && (
              <>
                <p className="text-gray-600 mb-2">
                  Product: <span className="font-semibold">{selectedProduct.name}</span>
                </p>
                <p className="text-gray-600 mb-4">
                  Current Quantity: <span className="font-semibold">{selectedProduct.quantity}</span>
                </p>
              </>
            )}

            <input
              type="number"
              value={addQuantity}
              onChange={(e) => setAddQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter quantity to add"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStock}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {loading ? "Updating..." : "Add Stock"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
