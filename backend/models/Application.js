const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    position: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Shortlisted", "Accepted", "Rejected"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
