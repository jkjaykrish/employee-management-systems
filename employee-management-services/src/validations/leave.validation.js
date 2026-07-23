const Joi = require("joi");

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "MongoDB ObjectId Validation");

const applyLeaveValidation = Joi.object({
  leaveType: Joi.string().valid("Casual", "Sick", "Paid", "Others").required(),
  employee:Joi.string().hex().length(24).optional(),
  fromDate: Joi.date().required(),
  toDate: Joi.date().required(),
  reason: Joi.string().trim().required(),
  status:Joi.string().trim().valid("Pending", "Approved", "Rejected", "Returned", "Cancelled").required(),
  attachment: Joi.string().allow(null, ""),
  isActive:Joi.bool().default(true)
});

const updateLeaveValidation = Joi.object({
    leaveId:Joi.string().hex(),
    fromDate: Joi.date().iso().messages({
      "date.format": "fromDate must be a valid ISO date",
    }),
    toDate: Joi.date()
      .iso()
      .min(Joi.ref("fromDate"))
      .messages({
        "date.format": "toDate must be a valid ISO date",
        "date.min": "toDate must be equal to or after fromDate",
      }),
    leaveType: Joi.string().trim().messages({
      "string.base": "leaveType must be a string",
    }),
    reason: Joi.string().trim().max(500).messages({
      "string.max": "Reason cannot exceed 500 characters",
    }),
    resubmissionComment: Joi.string().trim().max(300).messages({
      "string.max": "Resubmission comment cannot exceed 300 characters",
    }),
    attachment: Joi.string().allow(null, "").trim(),
});

const approveLeaveValidation = Joi.object({
  leaveId:Joi.string().hex().optional(),
    status: Joi.string().valid("Approved", "Rejected").required().messages({
      "any.only": "Status must be either 'Approved' or 'Rejected'",
      "any.required": "Status is required",
    }),
    comment: Joi.string().trim().max(300).allow("", null).messages({
      "string.max": "Comment cannot exceed 300 characters",
    }),

});


module.exports = {
  applyLeaveValidation,
  updateLeaveValidation,
  approveLeaveValidation
};
