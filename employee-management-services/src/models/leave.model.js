const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    leaveNumber: {
      type: String,
      required: true,
      unique: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    leaveType: {
      type: String,
      required: true,
      enum: ["Casual", "Sick", "Paid", "Others"],
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      requird: true,
      trim: true,
    },
    attachment: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approved", "Rejected", "Returned", "Cancelled"],
      default: "Pending",
    },
    approvalHistory: [
      {
        actionBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "emplyoee",
        },
        status: String,
        comment: String,
        actionAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("employee_leave", leaveSchema);
