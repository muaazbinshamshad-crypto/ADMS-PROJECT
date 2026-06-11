const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Student = require("./models/Student");
const Company = require("./models/Company");
const Application = require("./models/Application");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await Application.deleteMany();
    await Company.deleteMany();
    await Student.deleteMany();
    await User.deleteMany();

    const password = await bcrypt.hash("123456", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@gmail.com",
      password,
      role: "admin"
    });

    const studentUser = await User.create({
      name: "Ali Maseel",
      email: "student@gmail.com",
      password,
      role: "student"
    });

    const student = await Student.create({
      userId: studentUser._id,
      department: "Computer Science",
      cgpa: 3.4,
      skills: ["Node.js", "MongoDB", "JavaScript"],
      resumeLink: "https://example.com/resume.pdf"
    });

    const companies = await Company.insertMany([
      {
        name: "Systems Limited",
        sector: "Software House",
        position: "Backend Intern",
        requirements: ["Node.js", "MongoDB", "Express.js"],
        deadline: "2026-07-30"
      },
      {
        name: "10Pearls",
        sector: "Software Development",
        position: "Web Developer Intern",
        requirements: ["HTML", "CSS", "JavaScript"],
        deadline: "2026-08-15"
      },
      {
        name: "Techlogix",
        sector: "IT Services",
        position: "Database Intern",
        requirements: ["MongoDB", "SQL", "Data Modeling"],
        deadline: "2026-08-20"
      }
    ]);

    await Application.create({
      studentId: student._id,
      companyId: companies[0]._id,
      position: companies[0].position,
      status: "Pending"
    });

    console.log("Sample data inserted successfully");
    console.log("Admin login: admin@gmail.com / 123456");
    console.log("Student login: student@gmail.com / 123456");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
}

seed();
