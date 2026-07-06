import studentModel from "../models/student.model.js"
import userModel from "../models/userSchema.model.js"
import bcrypt from "bcryptjs"

const addStudent = async(req,res) => {
    try {
         const {
    name,
    email,
    password,

    admissionNo,
    class: studentClass,
    section,
    rollNo,

    fatherName,
    motherName,
    phone,

    gender,
    dateOfBirth,
    joiningDate,

    category,

    aadharNo,
    samagraId,
    apaarId,
    panNo,
    usesTransport,
    address
} = req.body;

          const isUserAlreadyExist = await userModel.findOne({email})
          if(isUserAlreadyExist){
            return res.status(409).json({
                success: false,
                message: "User Already Exist"
            })
          }

          const hashedPassword = await bcrypt.hash(password, 10)

          if (aadharNo && !/^\d{12}$/.test(aadharNo)) {
    return res.status(400).json({
        success: false,
        message: "Aadhaar number must be exactly 12 digits"
    });
}

if (phone && !/^\d{10}$/.test(phone)) {
    return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits"
    });
}

if (panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNo)) {
    return res.status(400).json({
        success: false,
        message: "Invalid PAN number"
    });
}

if (address?.pincode && !/^\d{6}$/.test(address.pincode)) {
    return res.status(400).json({
        success: false,
        message: "Pincode must be exactly 6 digits"
    });
}

if (aadharNo) {

    const existing = await studentModel.findOne({ aadharNo });

    if (existing) {
        return res.status(409).json({
            success: false,
            message: "Aadhaar number already exists"
        });
    }
}

if (samagraId) {

    const existing = await studentModel.findOne({ samagraId });

    if (existing) {
        return res.status(409).json({
            success: false,
            message: "Samagra ID already exists"
        });
    }
}

if (apaarId) {

    const existing = await studentModel.findOne({ apaarId });

    if (existing) {
        return res.status(409).json({
            success: false,
            message: "APAAR ID already exists"
        });
    }
}

          const user = await userModel.create({
            name, email, password: hashedPassword, role: "student"
          })

        const student = await studentModel.create({
    userId: user._id,

    admissionNo,
    class: studentClass,
    section,
    rollNo,

    fatherName,
    motherName,
    phone,

    gender,
    dateOfBirth,
    joiningDate,

    category,

    aadharNo,
    samagraId,
    apaarId,
    panNo,

    address,
    usesTransport
});

          return res.status(201).json({
            success: true,
            message: "Student Added Successfully",
            student
          })
   
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            success : false,
            message: "Internet Server Error"
        })
    }
}

const getStudents = async (req, res) => {
    try {

        const { class: studentClass, category, village, search } = req.query;
        const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 20;
const totalStudents = await studentModel.countDocuments(filter);
const skip = (page - 1) * limit;

        const filter = {};

        if (studentClass) {
            filter.class = studentClass;
        }

        if (category) {
            filter.category = category;
        }

        if (village) {
            filter["address.village"] = village;
        }

        const students = await studentModel
.find(filter)
.populate("userId", "name email")
.sort({ [sortBy]: order })
.skip(skip)
.limit(limit);

        // Search by Name / Admission No / Aadhaar
        if (search) {
            const q = search.toLowerCase();

            students = students.filter(student =>
                student.userId?.name?.toLowerCase().includes(q) ||
                student.admissionNo?.toLowerCase().includes(q) ||
                student.aadharNo?.includes(q)
            );
        }

        return res.status(200).json({
    success: true,
    students,

    pagination: {
        page,
        limit,
        totalStudents,
        totalPages: Math.ceil(totalStudents / limit)
    }
});

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getStudentbyId = async(req, res) => {
    try {
        const {id} = req.params;

        const student = await studentModel.findById(id).populate("userId", "name email");

        if(!student){
            return res.status(404).json({
                success: false,
                message: "Student not Found"
            })
        }

        return res.status(200).json({
            success: true,
            student
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Error finding by Id"
        })
    }
}

const updatebyId = async(req, res) => {

    try {
console.log("BODY:", req.body);
      const {id} = req.params

      const {
    name,
    email,

    class: studentClass,
    section,
    rollNo,

    fatherName,
    motherName,
    phone,

    gender,
    dateOfBirth,
    joiningDate,

    category,

    aadharNo,
    samagraId,
    apaarId,
    panNo,

    address,
    usesTransport
} = req.body;

    const student = await studentModel.findById(id)

    if(!student){
        return res.status(404).json({
            success: false,
            message: "Student not found"
        })
    }

    await userModel.findByIdAndUpdate(student.userId, {name , email})

  const updatedStudent = await studentModel.findByIdAndUpdate(
    id,
    {
        class: studentClass,
        section,
        rollNo,
        fatherName,
        motherName,
        phone,
        gender,
        dateOfBirth,
        joiningDate,
        category,
        aadharNo,
        samagraId,
        apaarId,
        panNo,
        address,
        usesTransport
    },
    { new: true }
);

    return res.status(200).json({
        success: true,
        message: "Student Updated Successfully"
    })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const deletebyId = async(req, res) => {
    try {
        const {id} = req.params;

        const student = await studentModel.findById(id);
        if (!student) {

    return res.status(404).json({

        success: false,

        message: "Student not found"

    });

}

        await studentModel.findByIdAndDelete(id)

        await userModel.findByIdAndDelete(student.userId)

        return res.status(200).json({
            success: true,
            message: "Student Deleted Successfully"
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
export default {addStudent, getStudents, getStudentbyId, updatebyId, deletebyId}