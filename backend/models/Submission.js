
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answer: {
      type: String,
      trim: true,
      default: "",
    },

    fileUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Submitted", "Reviewed"],
      default: "Submitted",
    },

    feedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// One submission per student per assignment
submissionSchema.index(
  { assignment: 1, student: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Submission",
  submissionSchema
);
