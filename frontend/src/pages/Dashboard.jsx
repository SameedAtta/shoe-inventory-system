import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, ChevronDown, CloudUpload } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [range, setRange] = useState("monthly"); // default
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [backupLink, setBackupLink] = useState("");

  // ===========================
  // 🧠 Fetch Dashboard Stats
  // ===========================
  useEffect(() => {
    fetchStats();
  }, [range, customRange]);

  const fetchStats = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const params =
        range === "custom"
          ? { range, startDate: customRange.start, endDate: customRange.end }
          : { range };

      const res = await axios.get("http://localhost:3006/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setStats(res.data);
    } catch (err) {
      console.error("Dashboard error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    }
  };

  // ===========================
  // ☁️ Upload Backup to Cloud
  // ===========================
  const handleBackup = async () => {
    setUploading(true);
    setMessage("");
    setBackupLink("");
    try {
      const res = await fetch("http://localhost:3006/api/backup", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Backup uploaded successfully!");
        setBackupLink(data.link);
      } else {
        setMessage("❌ Backup failed: " + data.error);
      }
    } catch (err) {
      setMessage("❌ Error connecting to server: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ===========================
  // 📆 Range Selector Options
  // ===========================
  const options = [
    { label: "📆 Weekly", value: "weekly" },
    { label: "📅 Monthly", value: "monthly" },
    { label: "📊 Yearly", value: "yearly" },
    { label: "📌 Custom Range", value: "custom" },
  ];

  const handleSelect = (val) => {
    setRange(val);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with selector */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        {/* Range Selector */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 
                         text-white px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition"
            >
              <Calendar size={18} />
              <span>
                {options.find((o) => o.value === range)?.label || "Select Range"}
              </span>
              <ChevronDown size={16} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-lg bg-white ring-1 ring-gray-200 z-50">
                <div className="py-2">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 
                                  hover:text-indigo-600 transition ${
                                    range === opt.value
                                      ? "bg-indigo-100 font-semibold"
                                      : ""
                                  }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Custom Range Date Inputs */}
          {range === "custom" && (
            <div className="flex gap-2">
              <input
                type="date"
                value={customRange.start}
                onChange={(e) =>
                  setCustomRange({ ...customRange, start: e.target.value })
                }
                className="border rounded-lg px-3 py-2 shadow-sm focus:ring-indigo-400 focus:border-indigo-400"
              />
              <input
                type="date"
                value={customRange.end}
                onChange={(e) =>
                  setCustomRange({ ...customRange, end: e.target.value })
                }
                className="border rounded-lg px-3 py-2 shadow-sm focus:ring-indigo-400 focus:border-indigo-400"
              />
            </div>
          )}
        </div>

        {/* ☁️ Upload Button */}
        <button
          onClick={handleBackup}
          disabled={uploading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition 
                     ${
                       uploading
                         ? "bg-gray-400 cursor-not-allowed"
                         : "bg-blue-600 hover:bg-blue-700 text-white"
                     }`}
        >
          <CloudUpload size={18} />
          {uploading ? "Uploading..." : "Upload to Cloud"}
        </button>
      </div>

      {/* Upload status */}
      {message && (
        <p
          className={`text-center mb-4 font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      {backupLink && (
        <div className="text-center mb-6">
          <a
            href={backupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on Google Drive
          </a>
        </div>
      )}

      {error && <div className="text-red-600 text-center">{error}</div>}

      {/* Stats */}
      {!stats ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-6">
          <StatCard
            label="Total Revenue"
            value={`Rs. ${stats.totalRevenue}`}
            color="bg-blue-500"
          />
          <StatCard
            label="Shoes Sold"
            value={stats.shoesSold}
            color="bg-green-500"
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`p-6 rounded-xl shadow-lg text-white ${color}`}>
      <h2 className="text-lg font-semibold mb-2">{label}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}







// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Calendar, ChevronDown } from "lucide-react";

// export default function Dashboard() {
//   const [stats, setStats] = useState(null);
//   const [error, setError] = useState("");
//   const [range, setRange] = useState("monthly"); // default
//   const [customRange, setCustomRange] = useState({ start: "", end: "" });
//   const [open, setOpen] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [backupLink, setBackupLink] = useState("");

//   const handleBackup = async () => {
//     setUploading(true);
//     setMessage("");
//     try {
//       const res = await fetch("http://localhost:3006/api/backup", {
//         method: "POST",
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage("✅ Backup uploaded successfully!");
//         setBackupLink(data.link);
//       } else {
//         setMessage("❌ Backup failed: " + data.error);
//       }
//     } catch (err) {
//       setMessage("❌ Error connecting to server: " + err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, [range, customRange]);

//   const fetchStats = async () => {
//     try {
//       const token = sessionStorage.getItem("token");
//       const params =
//         range === "custom"
//           ? { range, startDate: customRange.start, endDate: customRange.end }
//           : { range };

//       const res = await axios.get("http://localhost:3006/api/dashboard/stats", {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });

//       setStats(res.data);
//     } catch (err) {
//       console.error("Dashboard error:", err.response?.data || err.message);
//       setError(err.response?.data?.message || "Failed to load dashboard data");
//     }
//   };

//   const options = [
//     { label: "📆 Weekly", value: "weekly" },
//     { label: "📅 Monthly", value: "monthly" },
//     { label: "📊 Yearly", value: "yearly" },
//     { label: "📌 Custom Range", value: "custom" },
//   ];

//   const handleSelect = (val) => {
//     setRange(val);
//     setOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Header with selector */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

//         {/* Custom Selector */}
//         <div className="relative">
//           <button
//             onClick={() => setOpen(!open)}
//             className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 
//                        text-white px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition"
//           >
//             <Calendar size={18} />
//             <span>
//               {options.find((o) => o.value === range)?.label || "Select Range"}
//             </span>
//             <ChevronDown size={16} />
//           </button>

//           {open && (
//             <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-lg bg-white ring-1 ring-gray-200 z-50">
//               <div className="py-2">
//                 {options.map((opt) => (
//                   <button
//                     key={opt.value}
//                     onClick={() => handleSelect(opt.value)}
//                     className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 
//                                 hover:text-indigo-600 transition ${
//                                   range === opt.value
//                                     ? "bg-indigo-100 font-semibold"
//                                     : ""
//                                 }`}
//                   >
//                     {opt.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Custom date inputs when "custom" is selected */}
//         {range === "custom" && (
//           <div className="flex gap-2 ml-4">
//             <input
//               type="date"
//               value={customRange.start}
//               onChange={(e) =>
//                 setCustomRange({ ...customRange, start: e.target.value })
//               }
//               className="border rounded-lg px-3 py-2 shadow-sm focus:ring-indigo-400 focus:border-indigo-400"
//             />
//             <input
//               type="date"
//               value={customRange.end}
//               onChange={(e) =>
//                 setCustomRange({ ...customRange, end: e.target.value })
//               }
//               className="border rounded-lg px-3 py-2 shadow-sm focus:ring-indigo-400 focus:border-indigo-400"
//             />
//           </div>
//         )}
//       </div>

//       {error && <div className="text-red-600 text-center">{error}</div>}

//       {/* Stats */}
//       {!stats ? (
//         <div className="text-center text-gray-500">Loading...</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-6">
//           <StatCard
//             label="Total Revenue"
//             value={`Rs. ${stats.totalRevenue}`}
//             color="bg-blue-500"
//           />
//           <StatCard
//             label="Shoes Sold"
//             value={stats.shoesSold}
//             color="bg-green-500"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// function StatCard({ label, value, color }) {
//   return (
//     <div className={`p-6 rounded-xl shadow-lg text-white ${color}`}>
//       <h2 className="text-lg font-semibold mb-2">{label}</h2>
//       <p className="text-2xl font-bold">{value}</p>
//     </div>
//   );
// }


