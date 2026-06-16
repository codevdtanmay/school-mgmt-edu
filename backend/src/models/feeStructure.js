
import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true
  },

  tuitionFee: {
    type: Number,
    default: 0
  },

  admissionFee: {
    type: Number,
    default: 0
  },

  examFee: {
    type: Number,
    default: 0
  },

  transportFee: {
    type: Number,
    default: 0
  },

  otherFee: {
    type: Number,
    default: 0
  },

  totalFee: {
    type: Number,
    required: true
  }

}, { timestamps: true });

export default mongoose.model(
  "FeeStructure",
  feeStructureSchema
);