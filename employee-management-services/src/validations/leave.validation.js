const Joi = require("joi");

const applyLeaveValidation = Joi.object({
  leaveType: Joi.string().valid("Casual", "Sick", "Paid", "Others").required(),
  fromDate: Joi.date().required(),
  toDate: Joi.date().required(),
  reason: Joi.string().trim().required(),
  attachment: Joi.string().allow(null, ""),
});
module.exports = {
  applyLeaveValidation,
};
