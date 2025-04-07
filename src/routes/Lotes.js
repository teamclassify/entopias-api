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
  [
    body("id_product")
      .isInt({ gt: 0 })
      .withMessage(
        "El ID del producto es obligatorio y debe ser un número entero positivo"
      ),
    body("id_productor")
      .isInt({ gt: 0 })
      .withMessage(
        "El ID del productor es obligatorio y debe ser un número entero positivo"
      ),
    body("peso_comprado")
      .isFloat({ gt: 0 })
      .withMessage("El peso comprado debe ser un número mayor a 0"),
    body("peso_final")
      .isFloat({ gt: 0 })
      .withMessage("El peso final debe ser un número mayor a 0"),
    body("fecha_tostado")
      .isISO8601()
      .withMessage("La fecha de tostado debe ser una fecha válida"),
    body("tipo_tostado")
      .notEmpty()
      .withMessage("El tipo de tueste es obligatorio"),
    body("notas_olfativas")
      .notEmpty()
      .withMessage("Las notas olfativas son obligatorias"),
    body("fecha_caducidad")
      .isISO8601()
      .withMessage("La fecha de caducidad debe ser una fecha válida"),
    // El campo "precio_compra_grano" es opcional
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  controller.create
);

loteRouter.put(
  "/:id",
  verifyToken,
  isSalesOrAdmin,
  [
    body("id_product")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("El ID del producto debe ser un número entero positivo"),
    body("id_productor")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("El ID del productor debe ser un número entero positivo"),
    body("peso_comprado")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("El peso comprado debe ser un número mayor a 0"),
    body("peso_final")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("El peso final debe ser un número mayor a 0"),
    body("fecha_tostado")
      .optional()
      .isISO8601()
      .withMessage("La fecha de tostado debe ser válida"),
    body("tipo_tostado")
      .optional()
      .notEmpty()
      .withMessage("El tipo de tueste no puede estar vacío"),
    body("notas_olfativas")
      .optional()
      .notEmpty()
      .withMessage("Las notas olfativas no pueden estar vacías"),
    body("fecha_caducidad")
      .optional()
      .isISO8601()
      .withMessage("La fecha de caducidad debe ser válida"),
  ],
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
