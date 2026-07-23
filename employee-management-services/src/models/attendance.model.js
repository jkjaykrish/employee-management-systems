const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendanceDate: {
    type: Date,
    required: true
  },
  clockIn: {
    type: Date,
    required: true
  },
  clockOut: {
    type: Date,
    default: null
  },
  workingHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Present', 'Half-Day', 'Absent', 'On Leave'],
    default: 'Present'
  }
}, { timestamps: true });

attendanceSchema.index({ employee: 1, attendanceDate: 1 }, { unique: true });

module.exports = mongoose.model('attendance', attendanceSchema);