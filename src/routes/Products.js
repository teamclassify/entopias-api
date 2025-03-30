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
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
    body("loteId").isInt().withMessage("El ID del lote debe ser un número entero"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    controller.create
);

productRouter.post(
    "/update",
    verifyToken,
    isSalesOrAdmin,
    body("id").notEmpty().withMessage("El ID es obligatorio"),
    body("name").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
    body("descripcion").optional().notEmpty().withMessage("La descripción no puede estar vacía"),
    body("loteId").optional().isInt().withMessage("El ID del lote debe ser un número entero"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id, ...updateFields } = req.body;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "Debe proporcionar al menos un campo para actualizar" });
        }

        next();
    },
    controller.update
);

productRouter.delete("/:id", verifyToken, isAdmin, controller.delete);

export default productRouter;
