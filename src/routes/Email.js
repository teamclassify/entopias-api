import express from "express";
import EmailController from "../controllers/EmailController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/rbac.js"; // Ya lo usas así

const router = express.Router();
const controller = new EmailController();

router.post(
  "/invoices/:id/send-email",
  verifyToken,
  isAdmin,
  controller.sendInvoiceEmail
);

export default router;
