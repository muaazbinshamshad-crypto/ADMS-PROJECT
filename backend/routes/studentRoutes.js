const express = require("express");
const Student = require("../models/Student");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/profile", protect, async (req, res) => {
  try {
    const { department, cgpa, skills, resumeLink } = req.body;

    const existingProfile = await Student.findOne({ userId: req.user._id });

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists. Use update profile instead." });
    }

    const student = await Student.create({
      userId: req.user._id,
      department,
      cgpa,
      skills: Array.isArray(skills) ? skills : String(skills || "").split(",").map(s => s.trim()).filter(Boolean),
      resumeLink
    });

    res.status(201).json({ message: "Student profile created", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate("userId", "name email role");

    if (!student) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    if (typeof req.body.skills === "string") {
      req.body.skills = req.body.skills.split(",").map(s => s.trim()).filter(Boolean);
    }

    const student = await Student.findOneAndUpdate({ userId: req.user._id }, req.body, {
      new: true,
      runValidators: true
    });

    if (!student) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ message: "Profile updated", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
