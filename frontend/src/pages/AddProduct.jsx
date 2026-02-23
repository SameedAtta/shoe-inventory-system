// src/pages/AddProduct.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Building2, PlusCircle } from "lucide-react";
import axios from "axios";

export default function AddProduct() {
  const [companies, setCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState("");
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const dropdownRef = useRef();

  useEffect(() => {
    fetchCompanies();
    // close dropdown on outside click
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCompanyDropdownOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:3006/api/company");
      setCompanies(res.data || []);
    } catch (err) {
      console.error("Error fetching companies", err);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const handleSelectCompany = (c) => {
    setSelectedCompany(c);
    setCompanyDropdownOpen(false);
    setCompanySearch("");
  };

  const resetForm = () => {
    setSelectedCompany(null);
    setName("");
    setType("");
    setColor("");
    setSize("");
    setCostPrice("");
    setSalePrice("");
    setQuantity("");
    setManufactureDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompany) {
      setMessage("❌ Please select a company.");
      return;
    }
    if (!name || costPrice === "" || salePrice === "" || quantity === "") {
      setMessage("❌ Please fill required fields (name, cost, sale price, quantity).");
      return;
    }

    setLoading(true);
    setMessage("");
    console.log("Triggered", selectedCompany);

    try {
      const body = {
        companyId: selectedCompany?._id,
        name: name.trim(),
        type: type.trim(),
        color: color.trim(),
        size: size ? Number(size) : undefined,
        costPricePerBox: Number(costPrice),
        salePricePerBox: Number(salePrice),
        quantity: Number(quantity),
        manufactureDate: manufactureDate || undefined,
      };

      const res = await axios.post("http://localhost:3006/api/products", body);
      setMessage("✅ Product added successfully");
      // Refetch companies to keep things fresh (if needed)
      fetchCompanies();
      resetForm();
    } catch (err) {
      console.error("Add product error:", err.response?.data || err.message);
      setMessage("❌ Failed to add product: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-200 to-blue-300 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="bg-white/75 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl w-full max-w-3xl p-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Building2 className="text-blue-600" size={26} />
          <h2 className="text-2xl font-bold text-blue-800">Add Product</h2>
        </div>

        {message && (
          <div
            className={`text-center mb-4 font-medium ${
              message.startsWith("✅") ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company (searchable dropdown) */}
          <div ref={dropdownRef} className="relative">
            <label className="block mb-1 text-gray-700 font-medium">Company</label>
            <button
              type="button"
              onClick={() => setCompanyDropdownOpen((s) => !s)}
              className="w-full text-left bg-white border border-gray-300 rounded-xl px-4 py-3 flex items-center justify-between focus:ring-2 focus:ring-blue-500"
            >
              <div className="text-gray-700">
                {selectedCompany ? selectedCompany.name : "-- Select company --"}
              </div>
              <div className="text-gray-400">▾</div>
            </button>

            {companyDropdownOpen && (
              <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-3">
                  <input
                    autoFocus
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Search companies..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="max-h-52 overflow-auto">
                  {filteredCompanies.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">No companies found.</div>
                  ) : (
                    filteredCompanies.map((c) => (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => handleSelectCompany(c)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-800">{c.name}</span>
                        <span className="text-xs text-gray-400">{c._id.slice(0, 6)}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Row: name + type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Product Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Air Max 2025"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-medium">Type (optional)</label>
              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g. Sneakers"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Row: color + size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Color</label>
              <input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Black"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-medium">Size (optional)</label>
              <input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 42"
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Row: cost + sale price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Cost Price per Box (required)</label>
              <input
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="e.g. 1000"
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-medium">Sale Price per Box (required)</label>
              <input
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="e.g. 1500"
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Row: quantity + manufacture date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Quantity (boxes)</label>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 20"
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Manufacture Date (optional)</label>
              <input
                value={manufactureDate}
                onChange={(e) => setManufactureDate(e.target.value)}
                type="date"
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow"
            >
              <PlusCircle size={18} />
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
