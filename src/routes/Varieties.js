import express from "express";
import { body, validationResult } from "express-validator";
import VarietyController from "../controllers/VarietyController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin, isSalesOrAdmin } from "../middlewares/rbac.js";

const VarietyRouter = express.Router();
const controller = new VarietyController();

VarietyRouter.get("/", controller.getAll);
VarietyRouter.get("/:id", controller.getOne);

VarietyRouter.post(
  "/",
  verifyToken,
  isSalesOrAdmin,
  [
    body("stock")
      .isInt({ gt: 0 })
      .withMessage("Stock is required and must be an integer greater than 0"),
    body("peso")
      .isFloat({ gt: 0 })
      .withMessage("Weight is required and must be a number greater than 0"),
    body("precio")
      .isFloat({ gt: 0 })
      .withMessage("Price is required and must be a number greater than 0"),
    body("productId")
      .isInt({ gt: 0 })
      .withMessage("Product ID is required and must be a positive integer"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
  controller.create
);

VarietyRouter.put(
  "/:id",
  verifyToken,
  isSalesOrAdmin,
  [
    body("stock")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("If provided, stock must be an integer greater than 0"),
    body("peso")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("If provided, weight must be a number greater than 0"),
    body("precio")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("If provided, price must be a number greater than 0"),
    body("productId")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("If provided, product ID must be a positive integer"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    
    const { id, ...updateFields } = req.body;
    if (Object.keys(updateFields).length === 0)
      return res
        .status(400)
        .json({ error: "At least one field must be provided for update" });
    next();
  },
  controller.update
);

VarietyRouter.delete("/:id", verifyToken, isAdmin, controller.delete);

export default VarietyRouter;