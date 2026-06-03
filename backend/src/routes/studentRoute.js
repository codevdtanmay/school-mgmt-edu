
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import studentController from "../controllers/studentController.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router()

router.post("/add", authMiddleware, authorize("admin"), studentController.addStudent)
router.get("/", authMiddleware, authorize("admin", "teacher"), studentController.getStudents)

export default router