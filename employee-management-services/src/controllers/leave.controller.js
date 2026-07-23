const {
  applyLeaveService,
  getAllLeavesService,
  getOneLeavesService,
  updateLeaveService,
  approveLeaveService,
} = require("../services/leave.service");

const leaveController = async (req, res) => {
  try {
    const createLeave = await applyLeaveService(req.body, req.user);
    if (createLeave.success == false) {
      return res
        .status(200)
        .json({ success: false, message: createLeave.message });
    }
    return res.status(200).json({
      success: true,
      message: "Applied Leave Successfully",
      resultData: createLeave,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllLeaveController = async (req, res) => {
  try {
    const getLeaves = await getAllLeavesService(req.user);
    if (getLeaves) {
      return res.status(200).json({
        success: true,
        message: "Retrive Leave Successfully",
        resultData: getLeaves,
      });
    }
    return res.status(404).json({
      success: true,
      message: "Rercord Not Found",
      resultData: {},
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getOneLeaveController = async (req, res) => {
  try {
    const getLeavesDetails = await getOneLeavesService(req.body);
    return res.status(200).json({
      success: true,
      message: "Retrive Leave Successfully",
      resultData: getLeavesDetails,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const employeeUpdateLeaveController = async (req, res) => {
  try {
    const leaveId = req.body.leaveId;
    const userId = req.user._id || req.user.id;
    const updateData = req.body;

    const result = await updateLeaveService(leaveId, userId, updateData);

    if (!result.success) {
      return res.status(result.statusCode || 400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const approveLeaveController = async (req, res) => {
  try {
    const managerId = req.user._id || req.user.id;
    const { leaveId, status, comment } = req.body;

    const result = await approveLeaveService(leaveId, managerId, {
      status,
      comment,
    });

    if (!result.success) {
      return res.status(result.statusCode || 400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  leaveController,
  getAllLeaveController,
  getOneLeaveController,
  getOneLeaveController,
  employeeUpdateLeaveController,
  approveLeaveController,
};
