import express from "express";
import { body, validationResult } from "express-validator";

import ProductsController from "../controllers/ProductsController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin, isSales, isSalesOrAdmin } from "../middlewares/rbac.js";

const productsRouter = express.Router();
const controller = new ProductsController();

productsRouter.get("/", verifyToken, isSalesOrAdmin, controller.getAll);

export default productsRouter;
