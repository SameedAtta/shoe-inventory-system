import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";

export default function SaleRecords() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all sales from backend
  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3006/api/sales");
      setSales(res.data);
      setFilteredSales(res.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
      Swal.fire("Error", "Failed to load sales.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // ✅ Filter sales by customer name or date
  const handleSearch = (e) => {
    e.preventDefault();

    let filtered = [...sales];

    if (searchName.trim()) {
      filtered = filtered.filter((sale) =>
        sale.customerName?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchDate.trim()) {
      filtered = filtered.filter(
        (sale) => new Date(sale.saleDate).toISOString().split("T")[0] === searchDate
      );
    }

    setFilteredSales(filtered);
  };

  // ✅ Reset filters
  const handleReset = () => {
    setSearchName("");
    setSearchDate("");
    setFilteredSales(sales);
  };

  // ✅ Delete Sale with SweetAlert
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Deleting this sale will restore its stock.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3006/api/sales/${id}`);
      Swal.fire("Deleted!", "Sale deleted and stock updated.", "success");
      setSales((prev) => prev.filter((s) => s._id !== id));
      setFilteredSales((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting sale:", err);
      Swal.fire("Error", "Failed to delete sale.", "error");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">🧾 Sales Records</h2>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Search by Customer Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/4 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </form>

      {/* Sales Table */}
      <div className="bg-white shadow-md rounded-xl overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading sales...</p>
        ) : filteredSales.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No sales found.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-3 text-left">Client Name</th>
                <th className="border p-3 text-left">Product</th>
                <th className="border p-3 text-left">Company</th>
                <th className="border p-3 text-left">Boxes Sold</th>
                <th className="border p-3 text-left">Price/Box</th>
                <th className="border p-3 text-left">Total</th>
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr
                  key={sale._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="border p-3 font-medium">{sale.customerName}</td>
                  <td className="border p-3">{sale.product?.name || "—"}</td>
                  <td className="border p-3">{sale.company?.name || "—"}</td>
                  <td className="border p-3">{sale.boxesSold}</td>
                  <td className="border p-3">
                    Rs. {sale.salePricePerBox?.toLocaleString()}
                  </td>
                  <td className="border p-3 font-semibold">
                    Rs. {sale.totalPrice?.toLocaleString()}
                  </td>
                  <td className="border p-3">
                    {new Date(sale.saleDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => handleDelete(sale._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition flex items-center gap-1 mx-auto"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
