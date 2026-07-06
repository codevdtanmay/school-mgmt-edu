import express from "express";
import feeController from "../controllers/feeController.js";

const router = express.Router();

router.post("/collect", feeController.collectFee);
router.get("/", feeController.getAllFees)
router.get("/history", feeController.getFeeHistory);

export default router;