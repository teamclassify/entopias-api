import express from "express";
import { body, validationResult } from "express-validator";
import VariedadController from "../controllers/VariedadController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin, isSalesOrAdmin } from "../middlewares/rbac.js";

const router = express.Router();
const controller = new VariedadController();

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

router.post(
  "/",
  verifyToken,
  isSalesOrAdmin,
  [
    body("stock")
      .isInt({ gt: 0 })
      .withMessage(
        "El stock es obligatorio y debe ser un número entero mayor que 0"
      ),
    body("peso")
      .isFloat({ gt: 0 })
      .withMessage("El peso es obligatorio y debe ser un número mayor que 0"),
    body("precio")
      .isFloat({ gt: 0 })
      .withMessage("El precio es obligatorio y debe ser un número mayor que 0"),
    body("productId")
      .isInt({ gt: 0 })
      .withMessage(
        "El ID del producto es obligatorio y debe ser un número entero positivo"
      ),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
  controller.create
);

router.put(
  "/:id",
  verifyToken,
  isSalesOrAdmin,
  [
    body("stock")
      .optional()
      .isInt({ gt: 0 })
      .withMessage(
        "El stock, si se envía, debe ser un número entero mayor que 0"
      ),
    body("peso")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("El peso, si se envía, debe ser un número mayor que 0"),
    body("precio")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("El precio, si se envía, debe ser un número mayor que 0"),
    body("productId")
      .optional()
      .isInt({ gt: 0 })
      .withMessage(
        "El ID del producto, si se envía, debe ser un número entero positivo"
      ),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    // Validar que se envíe al menos un campo para actualizar
    const { id, ...updateFields } = req.body;
    if (Object.keys(updateFields).length === 0)
      return res
        .status(400)
        .json({ error: "Debe proporcionar al menos un campo para actualizar" });
    next();
  },
  controller.update
);

router.delete("/:id", verifyToken, isAdmin, controller.delete);

export default router;
