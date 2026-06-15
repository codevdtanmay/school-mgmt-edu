import mongoose from "mongoose";

const studentFeeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true
    },

    totalFee: {
      type: Number,
      required: true,
      default: 2800
    },

    paidAmount: {
      type: Number,
      default: 0
    },

    dueAmount: {
      type: Number,
      default: 2800
    },

    status: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("FeePayment", studentFeeSchema);