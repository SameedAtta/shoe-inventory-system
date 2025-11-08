require("./db/database");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const apiRoutes = require("./routes/index");
const backupRoutes = require("./routes/backupRoutes");
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL (Vite default)
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Running" });
});

// Routes

app.use("/api/backup", backupRoutes);

app.use("/api", apiRoutes);

module.exports = app;




