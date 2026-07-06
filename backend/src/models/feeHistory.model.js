import mongoose from "mongoose";

const feeHistorySchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer"],
      required: true
    },

    receiptNo: {
      type: String,
      required: true
    },

    remarks: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("FeeHistory", feeHistorySchema);