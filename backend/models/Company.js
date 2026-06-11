const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sector: { type: String, required: true },
    position: { type: String, required: true },
    requirements: { type: [String], default: [] },
    deadline: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
