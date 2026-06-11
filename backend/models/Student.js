const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    department: { type: String, required: true },
    cgpa: { type: Number, required: true },
    skills: { type: [String], default: [] },
    resumeLink: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
