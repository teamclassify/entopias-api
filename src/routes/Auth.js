import express from "express";
import { body } from "express-validator";

import AuthController from "../controllers/AuthController.js";
import verifyToken from "../middlewares/verifyToken.js";

const authRouter = express.Router();
const controller = new AuthController();

authRouter.get("/me", verifyToken, controller.me);

authRouter.post(
  "/login",

  verifyToken,

  [
    body("name").notEmpty().withMessage("El nombre es requerido."),
    body("email").isEmail().withMessage("El email debe ser válido."),
  ],

  controller.login,
);

export default authRouter;
