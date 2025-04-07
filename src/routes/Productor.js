import express from "express";
import { body } from "express-validator";
import ProductorController from "../controllers/ProductorController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/rbac.js";

const productorRouter = express.Router();

// Todas las rutas requieren que el usuario sea ADMIN

productorRouter.get("/", verifyToken, isAdmin, ProductorController.getAllProductores);

productorRouter.get("/:id", verifyToken, isAdmin, ProductorController.getProductorById);

productorRouter.post(
  "/",
  verifyToken,
  isAdmin,
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio."),
    body("telefono").notEmpty().withMessage("El teléfono es obligatorio."),
    body("ciudad").notEmpty().withMessage("La ciudad es obligatoria."),
    body("pais").notEmpty().withMessage("El país es obligatorio."),
    // finca y direccion son opcionales
  ],
  ProductorController.createProductor
);

productorRouter.put(
  "/:id",
  verifyToken,
  isAdmin,
  [
    body("nombre").optional().notEmpty().withMessage("El nombre debe ser válido."),
    body("direccion").optional().notEmpty().withMessage("La dirección debe ser válida."),
    body("telefono").optional().notEmpty().withMessage("El teléfono debe ser válido."),
  ],
  ProductorController.updateProductor
);

productorRouter.delete("/:id", verifyToken, isAdmin, ProductorController.deleteProductor);

export default productorRouter;