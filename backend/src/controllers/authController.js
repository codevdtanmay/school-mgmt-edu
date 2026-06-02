import userModel from "../models/userSchema.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const register = async(req,res) => {
   try {
     
       
    const {name, email, password, role} = req.body;

    const isUserAlreadyExist = await userModel.findOne({email});
    if (isUserAlreadyExist){
        return res.status(409).json({
            message: "User Already Exists"
        })
    } 

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name, email, password : hashedPassword, role
    })
    
   const token = jwt.sign({
     id: user._id,
   }, process.env.JWT_SECRET);

   res.cookie("token", token)


    res.status(201).json({
        message: "User Registered Successfully",
        user: {
           id: user._id,
           name: user.name,
           email: user.email,
           role: user.role 
  }
    })


   } catch (error) {
    console.log("Register User Issue");
    console.log(error)
   }
}

export default {register}