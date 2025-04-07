import express from "express";
import { body } from "express-validator";
import multer from "multer";

import ProductController from "../controllers/ProductController.js";
import { isAdmin, isSalesOrAdmin } from "../middlewares/rbac.js";
import verifyToken from "../middlewares/verifyToken.js";
import { generateUUID } from "../utils/generateUUID.js";

const productRouter = express.Router();
const controller = new ProductController();
const upload = multer({});

productRouter.get("/", controller.getAll);
productRouter.get("/:id", controller.getOne);

productRouter.post(
  "/",

  verifyToken,
  isSalesOrAdmin,

  upload.array("photos", 5, "No se puede subir más de 5 fotos"),

  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
    body("tipo").notEmpty().withMessage("El tipo es obligatorio"),
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

productRouter.put(
  "/:id",

  verifyToken,
  isSalesOrAdmin,

  [
    body("nombre")
    .optional()
    .notEmpty()
    .withMessage("El nombre, si se envía, no puede estar vacío"),
  body("descripcion")
    .optional()
    .notEmpty()
    .withMessage("La descripción, si se envía, no puede estar vacía"),
  body("tipo")
    .optional()
    .notEmpty()
    .withMessage("El tipo, si se envía, no puede estar vacío"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },

  controller.update
);

productRouter.delete("/:id", verifyToken, isAdmin, controller.delete);

export default productRouter;
