import express from "express";
import { body, validationResult } from "express-validator";
import BatchController from "../controllers/BatchController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin, isSalesOrAdmin } from "../middlewares/rbac.js";

const batchRouter = express.Router();
const controller = new BatchController();

batchRouter.get("/", verifyToken, isSalesOrAdmin, controller.getAll);
batchRouter.get("/:id", verifyToken, isSalesOrAdmin, controller.getOne);

batchRouter.post(
  "/",
  verifyToken,
  isSalesOrAdmin,
  [
    body("productId")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("The product ID is required and must be a positive integer"),
    body("producerId")
      .isInt({ gt: 0 })
      .withMessage("The producer ID is required and must be a positive integer"),
    body("initialWeight")
      .isFloat({ gt: 0 })
      .withMessage("Initial weight must be a number greater than 0"),
    body("finalWeight")
      .isFloat({ gt: 0 })
      .withMessage("Final weight must be a number greater than 0"),
    body("roastedDate")
      .isISO8601()
      .withMessage("Roast date must be a valid date"),
    body("roastedType")
      .notEmpty()
      .withMessage("Roast type is required"),
    body("aromaticNotes")
      .notEmpty()
      .withMessage("Aroma notes are required"),
    body("expirationDate")
      .isISO8601()
      .withMessage("Expiration date must be a valid date"),
    // purchasePrice is optional; no validation needed unless deseas validarlo
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
  controller.create
);

batchRouter.post(
  "/update",
  verifyToken,
  isSalesOrAdmin,
  [
    body("id")
      .isInt({ gt: 0 })
      .withMessage("The ID is required and must be a positive integer"),
    body("productId")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("If provided, product ID must be a positive integer"),
    body("producerId")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("If provided, producer ID must be a positive integer"),
    body("initialWeight")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("If provided, initial weight must be greater than 0"),
    body("finalWeight")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("If provided, final weight must be greater than 0"),
    body("roastDate")
      .optional()
      .isISO8601()
      .withMessage("If provided, roast date must be valid"),
    body("roastType")
      .optional()
      .notEmpty()
      .withMessage("If provided, roast type cannot be empty"),
    body("aromaNotes")
      .optional()
      .notEmpty()
      .withMessage("If provided, aroma notes cannot be empty"),
    body("expirationDate")
      .optional()
      .isISO8601()
      .withMessage("If provided, expiration date must be valid"),
    body("purchasePrice")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("If provided, purchase price must be greater than 0"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
      
    // Asegurarse de que se envíe al menos un campo para actualizar
    const { id, ...updateFields } = req.body;
    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one field must be provided for update" });
    }
    next();
  },
  controller.update
);

batchRouter.delete("/:id", verifyToken, isAdmin, controller.delete);

export default batchRouter;
