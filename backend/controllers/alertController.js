// controllers/alertController.js
const Alert = require("../models/Alert");

// Admin creates alert
exports.createAlert = async (req, res) => {
  try {
    // ✅ Make sure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ Only admin can post
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can post alerts" });
    }

    const { title, description, date, program } = req.body;

    // Validate input
    if (!title || !description || !date || !program) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const alert = await Alert.create({
      title,
      description,
      date,
      program,
      postedBy: req.user.id,
    });

    res.status(201).json({ message: "Alert posted successfully", alert });

  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ message: "Server error" });
  }
};
