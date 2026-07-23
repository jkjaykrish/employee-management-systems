const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const {
  createEmployee,
  employeeLogin,
  updateEmployee,
  FindOneEmployee,
  deleteEmployee,
} = require("../validations/employee.validations");
const { validate } = require("../middlewares/validate.middleware");
const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.post(
  "/",auth,authorize("Admin"),
  validate(createEmployee),
  employeeController.createEmployeeController,
);
router.post(
  "/login",
  validate(employeeLogin),
  employeeController.loginEmployeeController,
);
router.put(
  "/update",
  auth,
  authorize("Admin"),
  validate(updateEmployee),
  employeeController.updateEmployeeController,
);
router.post(
  "/id",
  auth,
  authorize("Admin"),
  validate(FindOneEmployee),
  employeeController.getOneEmployeeController,
);
router.patch(
  "/delete",
  auth,
  authorize("Admin"),
  validate(deleteEmployee),
  employeeController.deleteEmployeeController,
);
router.get(
  "/",
  auth,
  authorize("Admin"),
  employeeController.findAllEmployeeController,
);

module.exports = router;
