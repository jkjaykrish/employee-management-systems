const express = require("express");
const router = express.Router();
const { validate } = require("../middlewares/validate.middleware");
const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
  leaveController,
  getAllLeaveController,
  getOneLeaveController,
  employeeUpdateLeaveController,
  approveLeaveController,
} = require("../controllers/leave.controller");
const {
  applyLeaveValidation,
  updateLeaveValidation,
  approveLeaveValidation,
} = require("../validations/leave.validation");

router.post(
  "/",
  auth,
  authorize("Admin", "Manager", "Employee"),
  validate(applyLeaveValidation),
  leaveController,
);
router.get(
  "/",
  auth,
  authorize("Admin", "Manager", "Employee"),
  getAllLeaveController,
);
router.post(
  "/id",
  auth,
  authorize("Admin", "Manager", "Employee"),
  getOneLeaveController,
);
router.patch(
  "/id",
  auth,
  authorize("Employee"),
  validate(updateLeaveValidation),
  employeeUpdateLeaveController,
);
router.put(
  "/approvel",
  auth,
  authorize("Manager"),
  validate(approveLeaveValidation),
  approveLeaveController,
);

module.exports = router;
