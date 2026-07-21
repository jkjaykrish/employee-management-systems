const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const counter = require("./counter.model");
const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      match: /^[6-9]\d{9}$/,
    },
    department: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Manager", "Employee"],
      default: "Employee",
    },
    reportingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },

  { timestamps: true },
);

employeeSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter_ = await counter.findOneAndUpdate(
      {
        id: "employeeId",
      },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true },
    );
    this.employeeId=`EMP${String(counter_.sequenceValue).padStart(4,"0")}`
  }
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  // next();
});
employeeSchema.methods.comparePassword = async function (employeePassword) {
  return await bcrypt.compare(employeePassword, this.password);
};
module.exports = mongoose.model("Employee", employeeSchema);
