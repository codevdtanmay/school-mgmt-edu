import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        employeeId: {
            type: String,
            required: true,
            unique: true
        },

        department: {
            type: String,
            required: true
        },

        qualification: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Teacher", teacherSchema);