const express = require("express");
const Company = require("../models/Company");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, sector, position, requirements, deadline } = req.body;

    const company = await Company.create({
      name,
      sector,
      position,
      requirements: Array.isArray(requirements)
        ? requirements
        : String(requirements || "").split(",").map(s => s.trim()).filter(Boolean),
      deadline
    });

    res.status(201).json({ message: "Company added", company });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (typeof req.body.requirements === "string") {
      req.body.requirements = req.body.requirements.split(",").map(s => s.trim()).filter(Boolean);
    }

    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Company updated", company });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Company deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
