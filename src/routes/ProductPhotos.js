import express from "express";
import { body, validationResult } from "expre    ss-validator";
import ProductPhotoController from "../controllers/ProductPhotoController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin, isSalesOrAdmin } from "../middlewares/rbac.js";

const router = express.Router();
const controller = new ProductPhotoController();

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

// POST: Crear una foto - accesible para ventas o admin
router.post(
  "/",
  verifyToken,
  isSalesOrAdmin,
  [
    body("value")
      .notEmpty()
      .withMessage("El campo 'value' (URL de la foto) es obligatorio"),
    body("productId")
      .isInt({ gt: 0 })
      .withMessage("El ID del producto debe ser un número entero positivo"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
  controller.create
);

// PUT: Actualizar una foto - accesible para ventas o admin
router.put(
  "/:id",
  verifyToken,
  isSalesOrAdmin,
  [
    body("value")
      .optional()
      .notEmpty()
      .withMessage("Si se envía, el campo 'value' no puede estar vacío"),
    body("productId")
      .optional()
      .isInt({ gt: 0 })
      .withMessage(
        "Si se envía, el ID del producto debe ser un número entero positivo"
      ),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
  controller.update
);

// DELETE: Eliminar una foto - solo para administradores
router.delete("/:id", verifyToken, isAdmin, controller.delete);

export default router;
