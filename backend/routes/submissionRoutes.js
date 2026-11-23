
const express = require("express");
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// STUDENT SUBMITS ASSIGNMENT
router.post("/submit", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can submit assignments",
      });
    }

    const { assignmentId, answer } = req.body;

    if (!assignmentId || !answer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Assignment and answer are required",
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (new Date(assignment.dueDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Assignment deadline has passed",
      });
    }

    const submission = await Submission.findOneAndUpdate(
      {
        assignment: assignmentId,
        student: req.user.id,
      },
      {
        answer: answer.trim(),
        status: "Submitted",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (error) {
    console.error("Submit Assignment Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to submit assignment",
    });
  }
});

// STUDENT VIEWS OWN SUBMISSIONS
router.get("/my", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view their submissions",
      });
    }

    const submissions = await Submission.find({
      student: req.user.id,
    })
      .populate("assignment", "title subject dueDate")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch submissions",
    });
  }
});

// ADMIN VIEWS ALL SUBMISSIONS
router.get("/all", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can view all submissions",
      });
    }

    const submissions = await Submission.find()
      .populate("student", "name email studentId")
      .populate("assignment", "title subject dueDate")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Fetch All Submissions Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch submissions",
    });
  }
});

// ADMIN REVIEWS A SUBMISSION
router.patch("/review/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can review submissions",
      });
    }

    const { feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      {
        status: "Reviewed",
        feedback: feedback || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Submission reviewed successfully",
      submission,
    });
  } catch (error) {
    console.error("Review Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to review submission",
    });
  }
});

module.exports = router;
