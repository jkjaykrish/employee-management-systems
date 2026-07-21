const {
  createEmployeeService,
  loginUserService,
  updateEmployeeService,
  getOneEmployeeService,
  deleteEmployeeService,
  findAllEmployeeService
} = require("../services/employee.service");

const createEmployeeController = async (req, res) => {
  try {
    const createEmployee = await createEmployeeService(req.body);
    return res.status(201).json({
      success: true,
      message: "Employee Created Successfully",
      resultData: createEmployee,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const loginEmployeeController = async (req, res) => {
  try {
    const loginEmployee = await loginUserService(req.body);
    return res.status(200).json({
      success: true,
      message: "Access token ",
      resultData: loginEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEmployeeController = async (req, res) => {
  try {
    const updateEmployee = await updateEmployeeService(req.body);
    if (updateEmployee) {
      return res.status(200).json({
        success: true,
        message: "Employee Updated Successfully",
        resultData: updateEmployee,
      });
    } else {
      return res.status(404).json({
        success: true,
        message: "Employee Not Found",
        resultData: updateEmployee,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOneEmployeeController = async (req, res) => {
  try {
    const findOneEmployee = await getOneEmployeeService(req.body);
    if (findOneEmployee) {
      return res.status(200).json({
        success: true,
        message: "Find One Employee successfully",
        resultData: findOneEmployee,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEmployeeController = async (req, res) => {
  try {
    const deleteEmployee = await deleteEmployeeService(req.body);
    if (deleteEmployee) {
      return res.status(200).json({
        success: true,
        message: "Employee Updated Successfully",
        resultData: deleteEmployee,
      });
    } else {
      return res.status(404).json({
        success: true,
        message: "Employee Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const findAllEmployeeController=async (req,res)=>{
  try{
const getAllEmployee= await findAllEmployeeService();
if(!getAllEmployee){
  return res.status(404).json({success:false,message:"Employee not found"})
}
return res.status(200).json({success:true,message:"Find All Employee Successfully",resultData:getAllEmployee})
  }
  catch(error)
  {
    return res.status(500).json({success:true,message:error.message})
  }
}
module.exports = {
  createEmployeeController,
  loginEmployeeController,
  updateEmployeeController,
  getOneEmployeeController,
  deleteEmployeeController,
  findAllEmployeeController
};
