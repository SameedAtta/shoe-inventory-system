import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Trash2, PlusCircle, XCircle } from "lucide-react";
import axios from "axios";

export default function CompanyPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyProducts, setCompanyProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:3006/api/company");
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Add new company
  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a company name.");

    setLoading(true);
    try {
      await axios.post("http://localhost:3006/api/company", { name });
      setMessage("✅ Company added successfully!");
      setName("");
      fetchCompanies();
    } catch (err) {
      console.error("Error adding company:", err);
      setMessage("❌ Failed to add company");
    } finally {
      setLoading(false);
    }
  };

  // Delete company
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      await axios.delete(`http://localhost:3006/api/company/${id}`);
      setCompanies((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
   const goToStock = () => {
    navigate("/dashboard/stock"); // ✅ Correct path
  };

  // Open modal + fetch products
  const openCompanyModal = async (company) => {
    setSelectedCompany(company);
    setShowModal(true);
    setLoadingProducts(true);

    try {
      const res = await axios.get(
        `http://localhost:3006/api/products/company/${company._id}`
      );
      setCompanyProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCompany(null);
    setCompanyProducts([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-200 to-blue-300 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl w-full max-w-3xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6 flex items-center justify-center gap-2">
          <Building2 className="text-blue-600" size={28} />
          Manage Companies
        </h2>

        {message && (
          <div
            className={`text-center mb-4 font-semibold ${
              message.startsWith("✅") ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Add Company Form */}
        <form
          onSubmit={handleAddCompany}
          className="flex flex-col sm:flex-row items-center gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Enter company name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
          >
            <PlusCircle size={20} />
            {loading ? "Adding..." : "Add"}
          </motion.button>
        </form>

        {/* Company Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {companies.length === 0 ? (
            <p className="text-center text-gray-500 col-span-2">
              No companies found.
            </p>
          ) : (
            companies.map((company) => (
              <motion.div
                key={company._id}
                whileHover={{ scale: 1.03 }}
                onClick={() => openCompanyModal(company)}
                className="bg-white shadow-md border border-gray-200 rounded-2xl p-5 flex justify-between items-center hover:shadow-xl cursor-pointer transition group"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-500">{company._id}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(company._id);
                  }}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={20} />
                </motion.button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Company Modal */}
      <AnimatePresence>
        {showModal && selectedCompany && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition"
              >
                <XCircle size={26} />
              </button>

              <h3 className="text-2xl font-bold text-blue-700 mb-4">
                🏢 {selectedCompany.name}
              </h3>

              {loadingProducts ? (
                <p className="text-center text-gray-500">Loading products...</p>
              ) : companyProducts.length === 0 ? (
                <p className="text-center text-gray-500">
                  No products found for this company.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {companyProducts.map((p) => (
                    <div
                      key={p._id}
                      className="border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition bg-gradient-to-br from-white to-blue-50"
                    >
                      <h4 className="font-semibold text-gray-800">{p.name}</h4>
                      <p className="text-sm text-gray-600">Color: {p.color}</p>
                      <p className="text-sm text-gray-600">Size: {p.size}</p>
                      <p className="text-sm text-gray-600">
                        Stock:{" "}
                        <span
                          className={`font-bold ${
                            p.quantity === 0 ? "text-red-600" : "text-green-700"
                          }`}
                        >
                          {p.quantity}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: Rs {p.salePricePerBox}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 text-right">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
                  onClick={() => {
                    closeModal();
                    goToStock(); // navigate to stock page (you’ll create next)
                  }}
                >
                  Go to Stock Page
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Building2, Trash2, PlusCircle } from "lucide-react";
// import axios from "axios";

// export default function CompanyPage() {
//   const [companies, setCompanies] = useState([]);
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Fetch companies
//   const fetchCompanies = async () => {
//     try {
//       const res = await axios.get("http://localhost:3006/api/company");
//       setCompanies(res.data);
//     } catch (err) {
//       console.error("Error fetching companies", err);
//     }
//   };

//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   // Add new company
//   const handleAddCompany = async (e) => {
//     e.preventDefault();
//     if (!name.trim()) return alert("Please enter a company name.");

//     setLoading(true);
//     try {
//       const res = await axios.post("http://localhost:3006/api/company", { name });
//       setMessage("✅ Company added successfully!");
//       setName("");
//       fetchCompanies();
//     } catch (err) {
//       console.error("Error adding company:", err);
//       setMessage("❌ Failed to add company");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete company
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this company?")) return;
//     try {
//       await axios.delete(`http://localhost:3006/api/company/${id}`);
//       setCompanies(companies.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-200 to-blue-300 flex items-center justify-center p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl w-full max-w-3xl p-8"
//       >
//         <h2 className="text-3xl font-bold text-center text-blue-800 mb-6 flex items-center justify-center gap-2">
//           <Building2 className="text-blue-600" size={28} />
//           Manage Companies
//         </h2>

//         {message && (
//           <div className={`text-center mb-4 font-semibold ${message.startsWith("✅") ? "text-green-700" : "text-red-700"}`}>
//             {message}
//           </div>
//         )}

//         {/* Add Company Form */}
//         <form onSubmit={handleAddCompany} className="flex flex-col sm:flex-row items-center gap-3 mb-8">
//           <input
//             type="text"
//             placeholder="Enter company name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="flex-grow py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
//           />
//           <motion.button
//             whileTap={{ scale: 0.97 }}
//             type="submit"
//             disabled={loading}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
//           >
//             <PlusCircle size={20} />
//             {loading ? "Adding..." : "Add"}
//           </motion.button>
//         </form>

//         {/* Company List */}
//         <div className="grid sm:grid-cols-2 gap-4">
//           {companies.length === 0 ? (
//             <p className="text-center text-gray-500 col-span-2">No companies found.</p>
//           ) : (
//             companies.map((company) => (
//               <motion.div
//                 key={company._id}
//                 whileHover={{ scale: 1.02 }}
//                 className="bg-white shadow-md border border-gray-200 rounded-2xl p-5 flex justify-between items-center hover:shadow-lg transition"
//               >
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
//                   <p className="text-sm text-gray-500">{company._id}</p>
//                 </div>
//                 <motion.button
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleDelete(company._id)}
//                   className="text-red-600 hover:text-red-800 transition"
//                 >
//                   <Trash2 size={20} />
//                 </motion.button>
//               </motion.div>
//             ))
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// }
