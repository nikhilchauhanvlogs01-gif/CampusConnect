
const express = require("express");
const Assignment = require("../models/Assignment");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// CREATE ASSIGNMENT (ADMIN ONLY)
router.post("/create", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create assignments",
      });
    }

    const { title, description, subject, dueDate } = req.body;

    if (!title || !description || !subject || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const parsedDate = new Date(dueDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      dueDate: parsedDate,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    console.error("Create Assignment Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to create assignment",
    });
  }
});

// GET ALL ASSIGNMENTS
router.get("/all", verifyToken, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error("Fetch Assignments Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch assignments",
    });
  }
});

module.exports = router;
