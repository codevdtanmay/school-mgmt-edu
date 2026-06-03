import studentModel from "../models/student.model.js"
import userModel from "../models/userSchema.model.js"
import bcrypt from "bcryptjs"

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

          const user = await userModel.create({
            name, email, password: hashedPassword, role: "student"
          })

          const student = await studentModel.create({
             userId: user._id, admissionNo, class : studentClass, section, rollNo,
              fatherName, motherName, phone
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
            message: "Internet Server Error"
        })
    }
}

const getStudents = async(req, res) => {
    try {
        const students = await studentModel.find().populate("userId", "name email");
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
}}



export default {addStudent, getStudents}