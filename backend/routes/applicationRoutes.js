const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Student = require("../models/Student");
const Company = require("../models/Company");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/apply", protect, async (req, res) => {
  try {
    const { companyId } = req.body;

    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(400).json({ message: "Create student profile first" });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const duplicate = await Application.findOne({ studentId: student._id, companyId: company._id });

    if (duplicate) {
      return res.status(400).json({ message: "You already applied to this company" });
    }

    const application = await Application.create({
      studentId: student._id,
      companyId: company._id,
      position: company.position
    });

    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const applications = await Application.find({ studentId: student._id })
      .populate("companyId", "name sector position deadline")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "name email" }
      })
      .populate("companyId", "name sector position")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/aggregate-report", protect, adminOnly, async (req, res) => {
  try {
    const report = await Application.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      {
        $lookup: {
          from: "users",
          localField: "student.userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "company"
        }
      },
      { $unwind: "$company" },
      {
        $project: {
          studentName: "$user.name",
          studentEmail: "$user.email",
          department: "$student.department",
          cgpa: "$student.cgpa",
          skills: "$student.skills",
          companyName: "$company.name",
          sector: "$company.sector",
          position: "$position",
          status: "$status",
          appliedAt: "$createdAt"
        }
      },
      { $sort: { appliedAt: -1 } }
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application status updated", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
