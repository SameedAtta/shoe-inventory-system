import React, { useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import { Listbox, Transition } from "@headlessui/react";
import {
  ShoppingCart,
  User,
  DollarSign,
  Package,
  Building2,
  Calendar,
  Check,
  ChevronDown,
} from "lucide-react";
import axios from "axios";

export default function SellShoe() {
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [boxes, setBoxes] = useState(1);
  const [price, setPrice] = useState(0);
  const [stockLeft, setStockLeft] = useState(null);
  const [saleDate, setSaleDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 👀 Optional: track live saleDate changes
  useEffect(() => {
    console.log("Updated saleDate:", saleDate);
  }, [saleDate]);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("http://localhost:3006/api/company");
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies", err);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch products when company changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCompany) {
        setProducts([]);
        setSelectedProduct(null);
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:3006/api/products?company=${selectedCompany._id}`
        );
        setProducts(res.data);
        setSelectedProduct(null);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, [selectedCompany]);

  const onProductChange = (product) => {
    setSelectedProduct(product);
    if (product) {
      setPrice(product.salePricePerBox || 0);
      setStockLeft(product.quantity ?? 0);
      setBoxes(1);
    } else {
      setPrice(0);
      setStockLeft(null);
      setBoxes(1);
    }
  };

  const total = boxes * price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Select a product");
    if (boxes <= 0) return alert("Enter valid number of boxes");
    if (stockLeft != null && boxes > stockLeft) return alert("Not enough stock");

    setLoading(true);
    setMessage("");

    try {
      const token = sessionStorage.getItem("token");

      // 🧠 Convert date string to proper ISO date at local midnight
      const [year, month, day] = saleDate.split("-").map(Number);
      const localDate = new Date(year, month - 1, day);

      const body = {
        productId: selectedProduct._id,
        boxesSold: boxes,
        customSalePrice: price,
        customerName,
        // saleDate: localDate.toISOString(),
        saleDate,
      };


      const res = await axios.post("http://localhost:3006/api/sales", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Sale recorded successfully");

      // update stock locally
      const updatedProduct = res.data.updatedProduct;
      if (updatedProduct) {
        setStockLeft(updatedProduct.quantity);
        setProducts((prev) =>
          prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
        );
      }

      // reset form
      setCustomerName("");
      setSelectedProduct(null);
      setBoxes(1);
      setPrice(0);
      setSaleDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      console.error("Sale failed", err.response?.data || err.message);
      setMessage(
        "❌ Failed to record sale: " +
        (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/60 backdrop-blur-lg border border-white/30 shadow-xl p-8 rounded-3xl w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">
          🛍️ Sell Shoe
        </h2>

        {message && (
          <div className="text-center mb-4 font-medium">
            <span
              className={
                message.startsWith("✅") ? "text-green-700" : "text-red-700"
              }
            >
              {message}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🧍 Customer */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Customer Name
            </label>
            <div className="relative">
              <User className="absolute top-3.5 left-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Customer name"
                value={customerName}
                required
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* 🗓️ Sale Date Picker */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Sale Date
            </label>
            <div className="relative">
              <Calendar className="absolute top-3.5 left-3 text-gray-400" size={18} />
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={saleDate}
                onChange={(e) => {
                  const value = e.target.value;
                  setSaleDate(value);
                  console.log("Frontend selected saleDate:", value);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
              />
            </div>
          </div>

          {/* 🏢 Company Selector */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Select Company
            </label>
            <Listbox value={selectedCompany} onChange={setSelectedCompany}>
              <div className="relative">
                <Listbox.Button className="w-full pl-10 pr-10 py-3 text-left bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="text-gray-400" size={18} />
                    {selectedCompany ? selectedCompany.name : "-- Select company --"}
                  </span>
                  <ChevronDown className="text-gray-400" size={18} />
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-auto focus:outline-none">
                    {companies.map((c) => (
                      <Listbox.Option
                        key={c._id}
                        value={c}
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 flex items-center justify-between ${active ? "bg-blue-100 text-blue-800" : "text-gray-700"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className="font-medium">{c.name}</span>
                            {selected && <Check className="text-blue-600" size={18} />}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* 👟 Product Selector */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Select Product
            </label>
            <Listbox value={selectedProduct} onChange={onProductChange}>
              <div className="relative">
                <Listbox.Button className="w-full pl-10 pr-10 py-3 text-left bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="text-gray-400" size={18} />
                    {selectedProduct
                      ? `${selectedProduct.name} — Rs ${selectedProduct.salePricePerBox} (${selectedProduct.quantity} boxes)`
                      : "-- Select product --"}
                  </span>
                  <ChevronDown className="text-gray-400" size={18} />
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-auto focus:outline-none">
                    {products.map((p) => (
                      <Listbox.Option
                        key={p._id}
                        value={p}
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 flex items-center justify-between ${active ? "bg-green-100 text-green-800" : "text-gray-700"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className="font-medium">
                              {p.name} — Rs {p.salePricePerBox} — {p.quantity} boxes
                            </span>
                            {selected && <Check className="text-green-600" size={18} />}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            {selectedProduct && (
              <div className="mt-2 text-sm text-gray-600">
                Remaining stock: <span className="font-semibold">{stockLeft}</span> boxes
              </div>
            )}
          </div>

          {/* 📦 Boxes + 💰 Price */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label className="block mb-1 text-gray-700 font-medium">Boxes</label>
              <div className="relative">
                <Package className="absolute top-3.5 left-3 text-gray-400" size={18} />
                <input
                  type="number"
                  min="1"
                  value={boxes}
                  onChange={(e) => setBoxes(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="block mb-1 text-gray-700 font-medium">
                Price per Box (Rs)
              </label>
              <div className="relative">
                <DollarSign className="absolute top-3.5 left-3 text-gray-400" size={18} />
                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* 💵 Total */}
          <div className="text-xl font-semibold text-right text-gray-700">
            Total: <span className="text-green-600">Rs {total}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-800 text-white py-3 rounded-xl transition duration-300 font-semibold"
          >
            {loading ? "Processing..." : "💸 Sell Now"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}


// import React, { useState, useEffect, Fragment } from "react";
// import { motion } from "framer-motion";
// import { Listbox, Transition } from "@headlessui/react";
// import {
//   ShoppingCart,
//   User,
//   DollarSign,
//   Package,
//   Building2,
//   Check,
//   ChevronDown,
//   Calendar,
// } from "lucide-react";
// import axios from "axios";

// export default function SellShoe() {
//   const [companies, setCompanies] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [customerName, setCustomerName] = useState("");
//   const [boxes, setBoxes] = useState(1);
//   const [price, setPrice] = useState(0);
//   const [stockLeft, setStockLeft] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [saleDate, setSaleDate] = useState(() => new Date().toISOString().split("T")[0]); // 🆕 default today

//   useEffect(() => {
//   console.log("Updated saleDate:", saleDate);
// }, [saleDate]);
//   // Fetch companies once
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const res = await axios.get("http://localhost:3006/api/company");
//         setCompanies(res.data);
//       } catch (err) {
//         console.error("Error fetching companies", err);
//       }
//     };
//     fetchCompanies();
//   }, []);

//   // Fetch products when company changes
//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (!selectedCompany) {
//         setProducts([]);
//         setSelectedProduct(null);
//         return;
//       }
//       try {
//         const res = await axios.get(
//           `http://localhost:3006/api/products?company=${selectedCompany._id}`
//         );
//         setProducts(res.data);
//         setSelectedProduct(null);
//       } catch (err) {
//         console.error("Error fetching products", err);
//       }
//     };
//     fetchProducts();
//   }, [selectedCompany]);

//   const onProductChange = (product) => {
//     setSelectedProduct(product);
//     if (product) {
//       setPrice(product.salePricePerBox || 0);
//       setStockLeft(product.quantity ?? 0);
//       setBoxes(1);
//     } else {
//       setPrice(0);
//       setStockLeft(null);
//       setBoxes(1);
//     }
//   };

//   const total = boxes * price;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedProduct) return alert("Select a product");
//     if (boxes <= 0) return alert("Enter valid number of boxes");
//     if (stockLeft != null && boxes > stockLeft) return alert("Not enough stock");

//     setLoading(true);
//     setMessage("");

//     try {
//       const token = sessionStorage.getItem("token");
//       const body = {
//         productId: selectedProduct._id,
//         boxesSold: boxes,
//         customSalePrice: price,
//         customerName,
//       };

//       const res = await axios.post("http://localhost:3006/api/sales", body, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setMessage("✅ Sale recorded successfully");
//       const updatedProduct = res.data.updatedProduct;
//       if (updatedProduct) {
//         setStockLeft(updatedProduct.quantity);
//         setProducts((prev) =>
//           prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
//         );
//       }

//       setCustomerName("");
//       setSelectedProduct(null);
//       setBoxes(1);
//       setPrice(0);
//     } catch (err) {
//       console.error("Sale failed", err.response?.data || err.message);
//       setMessage("❌ Failed to record sale: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 80 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7, ease: "easeOut" }}
//         className="bg-white/60 backdrop-blur-lg border border-white/30 shadow-xl p-8 rounded-3xl w-full max-w-2xl"
//       >
//         <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">🛍️ Sell Shoe</h2>

//         {message && (
//           <div className="text-center mb-4 font-medium">
//             <span className={message.startsWith("✅") ? "text-green-700" : "text-red-700"}>
//               {message}
//             </span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Customer */}
//           <div>
//             <label className="block mb-1 text-gray-700 font-medium">Customer Name</label>
//             <div className="relative">
//               <User className="absolute top-3.5 left-3 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Customer name"
//                 value={customerName}
//                 required
//                 onChange={(e) => setCustomerName(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
//               />
//             </div>
//           </div>
//            {/* 🆕 Date Picker */}
//           <div>
//             <label className="block mb-1 text-gray-700 font-medium">Sale Date</label>
//             <div className="relative">
//               <Calendar className="absolute top-3.5 left-3 text-gray-400" size={18} />
//               <input
//                 type="date"
//                 max={new Date().toISOString().split("T")[0]} // 🆕 disable future dates
//                 onChange={(e) => {setSaleDate(e.target.value); console.log("Value",e.target.value);console.log("saleDate",saleDate);}}
//                 value={saleDate}
//                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
//               />
//             </div>
//           </div>
//           {/* Company Selector */}
//           <div>
//             <label className="block mb-1 text-gray-700 font-medium">Select Company</label>
//             <Listbox value={selectedCompany} onChange={setSelectedCompany}>
//               <div className="relative">
//                 <Listbox.Button className="w-full pl-10 pr-10 py-3 text-left bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 flex items-center justify-between">
//                   <span className="flex items-center gap-2">
//                     <Building2 className="text-gray-400" size={18} />
//                     {selectedCompany ? selectedCompany.name : "-- Select company --"}
//                   </span>
//                   <ChevronDown className="text-gray-400" size={18} />
//                 </Listbox.Button>
//                 <Transition
//                   as={Fragment}
//                   leave="transition ease-in duration-100"
//                   leaveFrom="opacity-100"
//                   leaveTo="opacity-0"
//                 >
//                   <Listbox.Options className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-auto focus:outline-none">
//                     {companies.map((c) => (
//                       <Listbox.Option
//                         key={c._id}
//                         value={c}
//                         className={({ active }) =>
//                           `cursor-pointer select-none px-4 py-2 flex items-center justify-between ${
//                             active ? "bg-blue-100 text-blue-800" : "text-gray-700"
//                           }`
//                         }
//                       >
//                         {({ selected }) => (
//                           <>
//                             <span className="font-medium">{c.name}</span>
//                             {selected && <Check className="text-blue-600" size={18} />}
//                           </>
//                         )}
//                       </Listbox.Option>
//                     ))}
//                   </Listbox.Options>
//                 </Transition>
//               </div>
//             </Listbox>
//           </div>

//           {/* Product Selector */}
//           <div>
//             <label className="block mb-1 text-gray-700 font-medium">Select Product</label>
//             <Listbox value={selectedProduct} onChange={onProductChange}>
//               <div className="relative">
//                 <Listbox.Button className="w-full pl-10 pr-10 py-3 text-left bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 flex items-center justify-between">
//                   <span className="flex items-center gap-2">
//                     <ShoppingCart className="text-gray-400" size={18} />
//                     {selectedProduct
//                       ? `${selectedProduct.name} — Rs ${selectedProduct.salePricePerBox} (${selectedProduct.quantity} boxes)`
//                       : "-- Select product --"}
//                   </span>
//                   <ChevronDown className="text-gray-400" size={18} />
//                 </Listbox.Button>
//                 <Transition
//                   as={Fragment}
//                   leave="transition ease-in duration-100"
//                   leaveFrom="opacity-100"
//                   leaveTo="opacity-0"
//                 >
//                   <Listbox.Options className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-auto focus:outline-none">
//                     {products.map((p) => (
//                       <Listbox.Option
//                         key={p._id}
//                         value={p}
//                         className={({ active }) =>
//                           `cursor-pointer select-none px-4 py-2 flex items-center justify-between ${
//                             active ? "bg-green-100 text-green-800" : "text-gray-700"
//                           }`
//                         }
//                       >
//                         {({ selected }) => (
//                           <>
//                             <span className="font-medium">
//                               {p.name} — Rs {p.salePricePerBox} — {p.quantity} boxes
//                             </span>
//                             {selected && <Check className="text-green-600" size={18} />}
//                           </>
//                         )}
//                       </Listbox.Option>
//                     ))}
//                   </Listbox.Options>
//                 </Transition>
//               </div>
//             </Listbox>
//             {selectedProduct && (
//               <div className="mt-2 text-sm text-gray-600">
//                 Remaining stock: <span className="font-semibold">{stockLeft}</span> boxes
//               </div>
//             )}
//           </div>

//           {/* Quantity + Price */}
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="w-full">
//               <label className="block mb-1 text-gray-700 font-medium">Boxes</label>
//               <div className="relative">
//                 <Package className="absolute top-3.5 left-3 text-gray-400" size={18} />
//                 <input
//                   type="number"
//                   min="1"
//                   value={boxes}
//                   onChange={(e) => setBoxes(Number(e.target.value))}
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
//                 />
//               </div>
//             </div>

//             <div className="w-full">
//               <label className="block mb-1 text-gray-700 font-medium">Price per Box (Rs)</label>
//               <div className="relative">
//                 <DollarSign className="absolute top-3.5 left-3 text-gray-400" size={18} />
//                 <input
//                   type="number"
//                   min="1"
//                   value={price}
//                   onChange={(e) => setPrice(Number(e.target.value))}
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Total */}
//           <div className="text-xl font-semibold text-right text-gray-700">
//             Total: <span className="text-green-600">Rs {total}</span>
//           </div>

//           <motion.button
//             whileTap={{ scale: 0.98 }}
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 hover:bg-green-800 text-white py-3 rounded-xl transition duration-300 font-semibold"
//           >
//             {loading ? "Processing..." : "💸 Sell Now"}
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }
