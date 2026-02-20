const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const alertRoutes = require("./routes/alertRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Failed:", err.message));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
