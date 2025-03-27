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

  controller.login
);

authRouter.post(
  "/register",

  [
    body("name").notEmpty().withMessage("El nombre es requerido."),
    body("email").isEmail().withMessage("El email debe ser válido."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres."),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("El teléfono debe ser válido."),
  ],

  controller.register
);

export default authRouter;
