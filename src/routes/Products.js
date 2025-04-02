import express from "express";
import { body, validationResult } from "express-validator";

import ProductController from "../controllers/ProductController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin, isSalesOrAdmin } from "../middlewares/rbac.js";

const productRouter = express.Router();
const controller = new ProductController();

productRouter.get("/", controller.getAll);
productRouter.get("/:id", controller.getOne);

productRouter.post(
  "/",

  verifyToken,
  isSalesOrAdmin,

  [
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
    body("precio")
      .isFloat({ gt: 0 })
      .withMessage("El precio debe ser un número mayor a 0"),
    body("stock")
      .isInt({ gt: 0 })
      .withMessage("El stock debe ser un número entero mayor a 0"),
    body("loteId")
      .isInt()
      .withMessage("El ID del lote debe ser un número entero"),
  ],

  controller.create
);

productRouter.put(
  "/:id",

  verifyToken,
  isSalesOrAdmin,

  [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("El nombre no puede estar vacío"),
    body("descripcion")
      .optional()
      .notEmpty()
      .withMessage("La descripción no puede estar vacía"),
    body("status")
      .optional()
      .isBoolean()
      .withMessage("El estado debe ser un valor booleano"),
    body("photos")
      .optional()
      .isArray()
      .withMessage("Las fotos deben ser un array de strings"),
  ],

  controller.update
);

productRouter.delete("/:id", verifyToken, isAdmin, controller.delete);

export default productRouter;
