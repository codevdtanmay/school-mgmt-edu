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
    }
  },
  {
    timestamps: true
  }

);

export default mongoose.model("Student", studentSchema)