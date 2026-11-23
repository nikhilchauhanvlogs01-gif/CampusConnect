
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

// GET PROFILE
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error while fetching profile",
    });
  }
});

// UPDATE PROFILE
router.put("/", verifyToken, async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      course,
      department,
      studentId,
      semester,
      session,
      college,
      photo,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.location = location ?? user.location;
    user.course = course ?? user.course;
    user.department = department ?? user.department;
    user.studentId = studentId ?? user.studentId;
    user.semester = semester ?? user.semester;
    user.session = session ?? user.session;
    user.college = college ?? user.college;

    if (typeof photo === "string") {
      user.photo = photo;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Server error while updating profile",
    });
  }
});

module.exports = router;
