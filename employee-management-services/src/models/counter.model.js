const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  sequenceValue: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("counter", counterSchema);
