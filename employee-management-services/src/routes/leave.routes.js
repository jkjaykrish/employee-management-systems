const express = require("express");
const router = express.Router();
const { validate } = require("../middlewares/validate.middleware");
const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { leaveController } = require("../controllers/leave.controller");
const { applyLeaveValidation } = require("../validations/leave.validation");

router.post(
  "/",
  auth,
  authorize("Admin", "Manager", "Employee"),
  validate(applyLeaveValidation),
  leaveController,
);

module.exports = router;
