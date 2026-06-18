import mongoose from "mongoose"

const studentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        admissionNo: {
            type: String,
            required: true,
            unique: true
        },
        class: {
            type: String,
            required: true
        },
        section: {
            type: String,
            required: true
        },
        rollNo: {
            type: Number,
            required: true
        }, 
        fatherName: {
            type: String
        },
        motherName: {
            type: String
       },
        phone: {
         type: String
    },

isDeleted: {
  type: Boolean,
  default: false
},

deletedAt: {
  type: Date,
  default: null
},


    feeStructureId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "FeeStructure"
},

totalFee: {
  type: Number,
  default: 0
},

paidAmount: {
  type: Number,
  default: 0
},

dueAmount: {
  type: Number,
  default: 0
},

status: {
  type: String,
  enum: ["Paid", "Partial", "Unpaid"],
  default: "Unpaid"
},

paymentHistory: [
  {
    receiptNo: String,
    amount: Number,
    date: String,
    paymentMethod: String
  }
]
  },
  {
    timestamps: true
  }

);

export default mongoose.model("Student", studentSchema)