const leaveModel = require("../models/leave.model");

const applyLeave = async (leaveData, user) => {
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
    employee: user.id,
    status: { $in: ["Pending", "Approved"] },
    $or: [{ fromDate: { $lte: endDate }, toDate: { $gte: startDate } }],
  });
  if (existingLeave) {
    return {
      success: false,message:"You have already pending or approved leave request for this leave range"
    }
  }
  const leaveCount = await leaveModel.countDocuments();
  const leaveNumber = `LV-${1000 + leaveCount + 1}`;
  const newLeave = new leaveModel({
    leaveNumber,
    employee: user.id,
    leaveType: leaveData.leaveType,
    fromDate: leaveData.fromDate,
    toDate: leaveData.toDate,
    reason: leaveData.reason,
    attachment: leaveData.attachment || null,
    status: "Pending",
  });

  return await newLeave.save();
};
module.exports = {
  applyLeave,
};
