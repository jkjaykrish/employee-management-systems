const attendanceService = require('../services/attendanceService');

exports.clockIn = async (req, res) => {
  try {
    const attendance = await attendanceService.clockIn(req.user._id);
    res.status(201).json({
      message: "Clocked in successfully",
      attendance
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Server Error" 
    });
  }
};


exports.clockOut = async (req, res) => {
  try {
    const attendance = await attendanceService.clockOut(req.user._id);
    res.status(200).json({
      message: "Clocked out successfully",
      attendance
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Server Error" 
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const result = await attendanceService.getAttendanceRecords(req.user, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Server Error" 
    });
  }
};