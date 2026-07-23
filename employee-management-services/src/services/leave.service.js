const leaveModel = require("../models/leave.model");
const userModel=require("../models/employee.model");


const applyLeaveService = async (leaveData, user) => {
  const startDate = new Date(leaveData.fromDate);
  const endDate = new Date(leaveData.toDate);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  if (startDate < todayDate) {
    return { success: false, message: "Can not apply Leave for Past date" };
  }
  if (endDate < startDate) {
    return {
      success: false,
      message: "To date must be equal or after from date",
    };
  }

  const sDate = new Date(startDate.setHours(0, 0, 0, 0));
  const eDate = new Date(endDate.setHours(0, 0, 0, 0));
  const diffTime = eDate - sDate;
  const diffDay = diffTime / (1000 * 60 * 60 * 24) + 1;
  if (diffDay > 30) {
    return {
      success: false,
      message: "Can not apply more than 30 Consecutive days",
    };
  }
  const existingLeave = await leaveModel.findOne({
    employee: user.id || user._id,
    status: { $in: ["Pending", "Approved"] },
    $or: [{ fromDate: { $lte: endDate }, toDate: { $gte: startDate } }],
  });
  if (existingLeave) {
    return {
      success: false,
      message:
        "You have already pending or approved leave request for this leave range",
    };
  }
  const leaveCount = await leaveModel.countDocuments();
  const leaveNumber = `LV-${1000 + leaveCount + 1}`;
  const newLeave = new leaveModel({
    leaveNumber,
    employee: user.id || user._id,
    leaveType: leaveData.leaveType,
    fromDate: leaveData.fromDate,
    toDate: leaveData.toDate,
    reason: leaveData.reason,
    attachment: leaveData.attachment || null,
    status: "Pending",
  });

  return await newLeave.save();
};

const getAllLeavesService = async (data) => {
  if (data.role === "Manager") {
    const otherUserLeaves = await leaveModel
      .find({ employee: { $ne: data.id } })
      .populate("employee")
      .sort({ createdAt: -1 });

    const ownLeaves = await leaveModel
      .find({ employee: data.id })
      .populate("employee")
      .sort({ createdAt: -1 });

    return {
      self: ownLeaves,
      employeeLeaves: otherUserLeaves,
    };
  } else if (data.role === "Employee") {
    const ownLeaves = await leaveModel
      .find({ employee: data.id })
      .populate("employee")
      .sort({ createdAt: -1 });
    return {
      self: ownLeaves,
      employeeLeaves: {},
    };
  }
};

const getOneLeavesService = async (data) => {
  return await leaveModel.findById({ _id: data.id }).populate("employee");
};

const updateLeaveService = async (leaveId, userId, updateData) => {

  const leave = await leaveModel.findById(leaveId);
  if (!leave) {
    return {
      success: false,
      statusCode: 404,
      message: "Leave request not found",
    };
  }
  if (leave.employee.toString() !== userId.toString()) {
    return {
      success: false,
      statusCode: 403,
      message: "Unauthorized to edit your own leave requests",
    };
  }

  if (leave.status === "Approved") {
    return {
      success: false,
      statusCode: 400,
      message:
        "Approved leaves cannot be modified. Contact HR to cancel or revoke.",
    };
  }
  const fromDateInput = updateData.fromDate
    ? new Date(updateData.fromDate)
    : leave.fromDate;
  const toDateInput = updateData.toDate
    ? new Date(updateData.toDate)
    : leave.toDate;
  const startDate = new Date(fromDateInput);
  const endDate = new Date(toDateInput);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizedStart = new Date(startDate);
  normalizedStart.setHours(0, 0, 0, 0);

  const normalizedEnd = new Date(endDate);
  normalizedEnd.setHours(0, 0, 0, 0);

  if (normalizedStart < today) {
    return {
      success: false,
      statusCode: 400,
      message: "Cannot apply or update leave to a past date",
    };
  }

  if (normalizedEnd < normalizedStart) {
    return {
      success: false,
      statusCode: 400,
      message: "To date must be equal to or after From date",
    };
  }

  const diffTime = normalizedEnd - normalizedStart;
  const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;
  if (diffDays > 30) {
    return {
      success: false,
      statusCode: 400,
      message: "Cannot apply for more than 30 consecutive days",
    };
  }

  const existingLeave = await leaveModel.findOne({
    _id: { $ne: leaveId },
    employee: userId,
    status: { $in: ["Pending", "Approved"] },
    $or: [
      {
        fromDate: { $lte: endDate },
        toDate: { $gte: startDate },
      },
    ],
  });

  if (existingLeave) {
    return {
      success: false,
      statusCode: 400,
      message:
        "You already have a pending or approved leave request during this date range",
    };
  }

  if (leave.status === "Rejected") {
    leave.status = "Pending";
    leave.approvalHistory.push({
      status: "Resubmitted",
      actionBy: userId,
      actionAt: new Date(),
      comment:
        updateData.resubmissionComment ||
        "Leave request resubmitted by employee",
    });
  }

  leave.fromDate = startDate;
  leave.toDate = endDate;
  leave.leaveType = updateData.leaveType || leave.leaveType;
  leave.reason = updateData.reason || leave.reason;
  if (updateData.attachment !== undefined) {
    leave.attachment = updateData.attachment;
  }

  const updatedLeave = await leave.save();
  return {
    success: true,
    message: "Leave request updated successfully",
    data: updatedLeave,
  };
};

const approveLeaveService = async (leaveId, managerId, { status, comment }) => {
  // Validate target status
  if (!["Approved", "Rejected"].includes(status)) {
    return {
      success: false,
      statusCode: 400,
      message: "Invalid status. Must be 'Approved' or 'Rejected'",
    };
  }

  const leave = await leaveModel.findById(leaveId);
  if (!leave) {
    return {
      success: false,
      statusCode: 404,
      message: "Leave request not found",
    };
  }

  // 1. Rule: Employees cannot approve their own leave
  if (leave.employee.toString() === managerId.toString()) {
    return {
      success: false,
      statusCode: 403,
      message: "You cannot approve or reject your own leave request",
    };
  }

  // 2. Rule: Only reporting manager can approve
  const applicant = await userModel.findById(leave.employee);
  if (!applicant) {
    return {
      success: false,
      statusCode: 404,
      message: "Applicant user record not found",
    };
  }

  if (applicant.reportingManager?.toString() !== managerId.toString()) {
    return {
      success: false,
      statusCode: 403,
      message:
        "Unauthorized: Only the assigned Reporting Manager can approve this request",
    };
  }

  leave.status = status;
  leave.approvalHistory.push({
    status: status,
    actionBy: managerId,
    actionAt: new Date(),
    comment: comment || `Leave request ${status.toLowerCase()} by manager`,
  });

  const processedLeave = await leave.save();
  return {
    success: true,
    message: `Leave request ${status.toLowerCase()} successfully`,
    data: processedLeave,
  };
};
module.exports = {
  applyLeaveService,
  getAllLeavesService,
  getOneLeavesService,
  updateLeaveService,
  approveLeaveService
};
