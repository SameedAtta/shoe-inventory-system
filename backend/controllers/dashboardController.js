// controllers/dashboardController.js
const Sale = require("../models/sale");

exports.getDashboardStats = async (req, res) => {
  try {
    const { range, startDate, endDate } = req.query; // 👈 comes from frontend
    const now = new Date();

    let start, end = now;

    if (range === "weekly") {
      start = new Date(now);
      start.setDate(now.getDate() - 7);
    } else if (range === "monthly") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === "yearly") {
      start = new Date(now.getFullYear(), 0, 1);
    } else if (range === "custom" && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default = current month
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // 📊 Aggregate sales based on range
    const stats = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: start, $lte: end }, // 👈 filter by selected range
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          shoesSold: { $sum: "$boxesSold" }, // adjust field if needed
        },
      },
    ]);

    res.json({
      range,
      startDate: start,
      endDate: end,
      totalRevenue: stats.length > 0 ? stats[0].totalRevenue : 0,
      shoesSold: stats.length > 0 ? stats[0].shoesSold : 0,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};








// const Sale = require("../models/sale");

// exports.getDashboardStats = async (req, res) => {
//   try {
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     // 📊 Monthly Sales (total revenue for current month)
//     const monthlySales = await Sale.aggregate([
//       { $match: { saleDate: { $gte: startOfMonth } } },
//       { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
//     ]);

//     // 📊 Daily Revenue + Shoes Sold
//     const dailyStats = await Sale.aggregate([
//       { $match: { saleDate: { $gte: startOfDay } } },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: "$totalPrice" },
//           shoesSold: { $sum: "$boxesSold" }, // or "$quantity" depending on your schema
//         },
//       },
//     ]);

//     res.json({
//       monthlySales: monthlySales.length > 0 ? monthlySales[0].totalSales : 0,
//       dailyRevenue: dailyStats.length > 0 ? dailyStats[0].totalRevenue : 0,
//       dailyShoesSold: dailyStats.length > 0 ? dailyStats[0].shoesSold : 0,
//     });
//   } catch (err) {
//     console.error("Error fetching dashboard stats:", err);
//     res.status(500).json({ message: "Failed to fetch dashboard stats" });
//   }
// };


