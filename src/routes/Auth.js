import express from "express";
import AuthController from "../controllers/AuthController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { loginValidator } from "../validators/loginValidator.js";

const authRouter = express.Router();
const controller = new AuthController();

authRouter.get("/me", verifyToken, controller.me);
authRouter.post("/login", verifyToken, loginValidator, controller.login);

export default authRouter;
