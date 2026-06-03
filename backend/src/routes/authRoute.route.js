
import authController from "../controllers/authController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(("/register"), authController.register)
router.post(("/login"), authController.login)
router.get(("/me"), authMiddleware, authController.getme)
export default router