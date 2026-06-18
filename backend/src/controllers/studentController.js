import studentModel from "../models/student.model.js"
import userModel from "../models/userSchema.model.js"
import bcrypt from "bcryptjs"
import feeStructureModel from "../models/feeStructure.js";

const addStudent = async(req,res) => {
    try {
          const {
            name,email,password,admissionNo,class: studentClass,
            section, rollNo, fatherName, motherName, phone
          } = req.body



          const isUserAlreadyExist = await userModel.findOne({email})
          if(isUserAlreadyExist){
            return res.status(409).json({
                success: false,
                message: "User Already Exist"
            })
          }

          const hashedPassword = await bcrypt.hash(password, 10)

          const feeStructure =
  await feeStructureModel.findOne({
    class: studentClass
  });
  if (!feeStructure) {
  return res.status(404).json({
    success: false,
    message: "Fee Structure not found"
  });
}

          const user = await userModel.create({
            name, email, password: hashedPassword, role: "student"
          })

          const student = await studentModel.create({
             userId: user._id, admissionNo, class : studentClass, section, rollNo,
              fatherName, motherName, phone,  feeStructureId: feeStructure._id,totalFee: feeStructure.totalFee,
  dueAmount: feeStructure.totalFee
          })

          return res.status(201).json({
            success: true,
            message: "Student Added Successfully",
            student
          })
   
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            success : false,
            message: "Internal Server Error"
        })
    }
}

const getStudents = async(req, res) => {
    try {
        const students = await studentModel.find({
  isDeleted: false
}).populate("userId", "name email");
        return res.status(200).json({
            success: true,
            students
        })
    } catch (error) {
        console.error(error)
         return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
    }
}

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
        name, email, class: studentClass, section, rollNo, fatherName,motherName, phone
         } = req.body

    const student = await studentModel.findById(id)

    if(!student){
        return res.status(404).json({
            success: false,
            message: "Student not found"
        })
    }

    await userModel.findByIdAndUpdate(student.userId, {name , email})

    await studentModel.findByIdAndUpdate(id, {class: studentClass, section, rollNo, fatherName,motherName, phone})

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

        await studentModel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date()
});

        await userModel.findByIdAndUpdate(student.userId,{
      isDeleted: true,
      deletedAt: new Date()
} )

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