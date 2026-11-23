
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Password Reset Fields
    resetPasswordToken: {
      type: String,
      default: undefined,
    },

    resetPasswordExpires: {
      type: Date,
      default: undefined,
    },

    // User Role
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // Contact Information
    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    // Academic Information
    course: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    studentId: {
      type: String,
      default: "",
    },

    semester: {
      type: String,
      default: "",
    },

    session: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    // Profile Photo
    photo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
