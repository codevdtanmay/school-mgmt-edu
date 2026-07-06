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
    gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male"
},

dateOfBirth: {
    type: Date
},

joiningDate: {
    type: Date,
    default: Date.now
},

category: {
    type: String,
    enum: ["General", "OBC", "SC", "ST"],
    default: "General"
},

aadharNo: {
    type: String,
    default: ""
},

samagraId: {
    type: String,
    default: ""
},

apaarId: {
    type: String,
    default: ""
},

panNo: {
    type: String,
    default: ""
},

address: {
    village: {
        type: String,
        default: ""
    },

    postOffice: {
        type: String,
        default: ""
    },

    tehsil: {
        type: String,
        default: ""
    },

    district: {
        type: String,
        default: ""
    },

    state: {
        type: String,
        default: ""
    },

    pincode: {
        type: String,
        default: ""
    },
    usesTransport: {
    type: Boolean,
    default: false
},
}
  },
  {
    timestamps: true
  }

);
studentSchema.index({ class: 1 });

studentSchema.index({ category: 1 });

studentSchema.index({ "address.village": 1 });

export default mongoose.model("Student", studentSchema)