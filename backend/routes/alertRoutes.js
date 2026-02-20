const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const { protect } = require("../middleware/authMiddleware");

// Get alerts (students only see their program alerts)
router.get("/", protect, async (req, res) => {
  try {
    const alerts = await Alert.find({ program: req.user.program })
      .sort({ createdAt: -1 })
      .populate("postedBy", "name email role");

    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create alert (Admin only)
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, program, date } = req.body;

    const alert = await Alert.create({
      title,
      description,
      program,
      date,
      postedBy: req.user._id,
    });

    res.status(201).json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;