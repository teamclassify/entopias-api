import express from "express";
import DashboardController from "../controllers/DashboardController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isSalesOrAdmin } from "../middlewares/rbac.js";

const router = express.Router();
const controller = new DashboardController();

router.get(
  "/summary",
  verifyToken,
  isSalesOrAdmin,
  controller.getAdminSummary
);

export default router;
