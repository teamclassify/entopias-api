import express from "express";

import CartController from "../controllers/CartController.js";
import verifyToken from "../middlewares/verifyToken.js";

const cartRouter = express.Router();
const controller = new CartController();

cartRouter.get("/", verifyToken, controller.getCart);

export default cartRouter;
