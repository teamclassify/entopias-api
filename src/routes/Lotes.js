import express from "express";
import { body, validationResult } from "express-validator";

import LoteController from "../controllers/LoteController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin, isSalesOrAdmin } from "../middlewares/rbac.js";

const loteRouter = express.Router();
const controller = new LoteController();

loteRouter.get("/", verifyToken, isSalesOrAdmin, controller.getAll);
loteRouter.get("/:id", verifyToken, isSalesOrAdmin, controller.getOne);

loteRouter.post(
  "/",
  verifyToken,
  isSalesOrAdmin,
  body("pesoCafe")
    .isFloat({ gt: 0 })
    .withMessage("El peso del café debe ser un número mayor a 0"),
  body("tipoTueste").notEmpty().withMessage("El tipo de tueste es obligatorio"),
  body("fechaTostado")
    .isISO8601()
    .withMessage("La fecha de tostado debe ser válida"),
  body("fechaLote")
    .isISO8601()
    .withMessage("La fecha del lote debe ser válida"),
  body("cafeId")
    .isInt({ gt: 0 })
    .withMessage("El ID del café debe ser un número entero positivo"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  controller.create
);

loteRouter.post(
  "/update",
  verifyToken,
  isSalesOrAdmin,
  body("id")
    .isInt({ gt: 0 })
    .withMessage("El ID es obligatorio y debe ser un número entero positivo"),
  body("pesoCafe")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("El peso del café debe ser mayor a 0"),
  body("tipoTueste")
    .optional()
    .notEmpty()
    .withMessage("El tipo de tueste no puede estar vacío"),
  body("fechaTostado")
    .optional()
    .isISO8601()
    .withMessage("La fecha de tostado debe ser válida"),
  body("fechaLote")
    .optional()
    .isISO8601()
    .withMessage("La fecha del lote debe ser válida"),
  body("cafeId")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El ID del café debe ser un número entero positivo"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, ...updateFields } = req.body;
    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar al menos un campo para actualizar" });
    }

    next();
  },
  controller.update
);

loteRouter.delete("/:id", verifyToken, isAdmin, controller.delete);

export default loteRouter;
