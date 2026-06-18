import express from "express";
import dashboardController from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  dashboardController.getDashboardStats
);

router.get(
  "/fees",
  authMiddleware,
  dashboardController.getFeeSummary
);

router.get(
  "/notices",
  authMiddleware,
  dashboardController.getRecentNotices
);

router.get(
  "/activities",
  authMiddleware,
  dashboardController.getActivities
);

export default router;