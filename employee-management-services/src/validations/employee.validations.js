const joi = require("joi");
const { schema } = require("../models/employee.model");

const createEmployee = joi.object({
  firstName: joi.string().trim().required(),
  lastName: joi.string().trim().required(),
  email: joi.string().trim().lowercase().required(),
  password: joi.string().min(6).max(20).trim().required(),
  mobile: joi.string().pattern(/^[6-9]\d{9}$/),
  department: joi.string().trim().required(),
  role: joi.string().valid("Admin", "Manager", "Employee").optional(),
  reportingManager: joi.string().hex().length(24).optional(),
  status: joi.boolean().optional(),
});
const employeeLogin = joi.object({
  email: joi.string().trim().lowercase().required(),
  password: joi.string().min(6).max(20).trim().required(),
});
const updateEmployee = joi.object({
  _id: joi.string().hex().length(24).optional(),
  firstName: joi.string().trim().required(),
  lastName: joi.string().trim().required(),
  email: joi.string().trim().lowercase().required(),
  password: joi.string().min(6).max(20).trim().required(),
  mobile: joi.string().pattern(/^[6-9]\d{9}$/),
  department: joi.string().trim().required(),
  role: joi.string().valid("Admin", "Manager", "Employee").optional(),
  reportingManager: joi.string().hex().length(24).optional(),
  status: joi.boolean().optional(),
});

const FindOneEmployee = joi.object({
  _id: joi.string().hex().length(24).optional(),
});

const deleteEmployee = joi.object({
  _id: joi.string().hex().length(24).optional(),
});



module.exports = {
  createEmployee,
  employeeLogin,
  updateEmployee,
  FindOneEmployee,
  deleteEmployee
};
