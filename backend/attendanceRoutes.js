
const express = require("express");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// MARK ATTENDANCE
router.post("/mark", verifyToken, async (req, res) => {
  try {
    const { studentId, subject, date, status } = req.body;

    if (!studentId || !subject || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance status",
      });
    }

    // Only admin can mark attendance
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can mark attendance",
      });
    }

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const attendanceDate = new Date(date);

    if (Number.isNaN(attendanceDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    attendanceDate.setUTCHours(0, 0, 0, 0);

    const record = await Attendance.findOneAndUpdate(
      {
        student: studentId,
        subject: subject.trim(),
        date: attendanceDate,
      },
      {
        $set: {
          status,
          markedBy: req.user.id,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Attendance saved successfully",
      attendance: record,
    });
  } catch (error) {
    console.error("Mark Attendance Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to save attendance",
    });
  }
});

// GET LOGGED-IN STUDENT ATTENDANCE
router.get("/my", verifyToken, async (req, res) => {
  try {
    const records = await Attendance.find({
      student: req.user.id,
    }).sort({ date: -1 });

    const total = records.length;
    const present = records.filter(
      (record) => record.status === "Present"
    ).length;

    const percentage =
      total === 0 ? 0 : Math.round((present / total) * 100);

    res.status(200).json({
      success: true,
      total,
      present,
      absent: total - present,
      percentage,
      records,
    });
  } catch (error) {
    console.error("Fetch Attendance Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch attendance",
    });
  }
});

module.exports = router;
