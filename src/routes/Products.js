import express from "express";
import { body } from "express-validator";
import multer from "multer";

import ProductController from "../controllers/ProductController.js";
import { isAdmin, isSalesOrAdmin } from "../middlewares/rbac.js";
import verifyToken from "../middlewares/verifyToken.js";

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
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("description").notEmpty().withMessage("La descripción es obligatoria"),
    body("type").notEmpty().withMessage("El tipo es obligatorio"),
    body("varieties").notEmpty().withMessage("Las variedades son obligatorias"),
  ],

  controller.create
);

productRouter.post(
  "/:id",

  verifyToken,
  isSalesOrAdmin,

  upload.array("newphotos", 5, "No se puede subir más de 5 fotos"),

  [
    body("name").notEmpty().withMessage("El nombre no puede estar vacío"),
    body("description")
      .notEmpty()
      .withMessage("La descripción no puede estar vacía"),
    body("status")
      .isBoolean()
      .withMessage("El estado debe ser un valor booleano"),
    body("type").notEmpty().withMessage("El tipo es obligatorio"),
    body("varieties")
      .isArray()
      .withMessage("Las variedades deben ser un array"),
  ],

  controller.update
);

productRouter.delete("/:id", verifyToken, isAdmin, controller.delete);

export default productRouter;
