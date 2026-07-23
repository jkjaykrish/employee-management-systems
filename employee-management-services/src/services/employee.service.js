const employeeModel = require("../models/employee.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const createEmployeeService = async (employeeData) => {
  return await employeeModel.create(employeeData);
};

const loginUserService = async (userData) => {
  const { email, password } = userData;

  const employee = await employeeModel.findOne({ email });
  if (!employee) return { success: false, message: "Invalid User" };
  const isMatch = await employee.comparePassword(password);
  if (!isMatch) return { success: false, message: "Invalid Password" };

  const token = jwt.sign(
    { id: employee._id, role: employee.role, email: employee.email },

    process.env.JWT_KEY,
    { expiresIn: "1d" },
  );
  return token;
};

const getOneEmployeeService = async (empID) => {
  return await employeeModel.findById(empID);
};

const updateEmployeeService = async (employeeData) => {
  const salt = await bcrypt.genSalt(10);
  employeeData.password = await bcrypt.hash(employeeData.password, salt);
  return await employeeModel.findByIdAndUpdate(
    employeeData.id,
    { $set: employeeData },
    { new: true },
  );
};

const deleteEmployeeService = async (employeeData) => {
  return await employeeModel.findByIdAndUpdate(
    employeeData._id,
    { status: false },
    { new: true },
  );
};

const findAllEmployeeService = async () => {
  return await employeeModel.find({ status: true });
};

module.exports = {
  createEmployeeService,
  loginUserService,
  updateEmployeeService,
  getOneEmployeeService,
  deleteEmployeeService,
  findAllEmployeeService,
};
