import express from "express";
import { body, validationResult } from "express-validator";

import CafeController from "../controllers/CafeController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin, isSales, isSalesOrAdmin } from "../middlewares/rbac.js";

const cafeRouter = express.Router();
const controller = new CafeController();

cafeRouter.get("/", verifyToken, isSalesOrAdmin, controller.getAll);
cafeRouter.get("/:id", verifyToken, isSalesOrAdmin, controller.getOne);
cafeRouter.post(
    "/",
    verifyToken,
    isSalesOrAdmin, //????
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("origen").notEmpty().withMessage("El origen es obligatorio"),
    body("finca").notEmpty().withMessage("La finca es obligatoria"),
    body("productor").notEmpty().withMessage("El productor es obligatorio"),
    body("cantidad")
        .isFloat({ gt: 0 })
        .withMessage("La cantidad debe ser un número mayor a 0"),
    body("proceso").notEmpty().withMessage("El proceso es obligatorio"),
    body("notasOlfativas").notEmpty().withMessage("Las notas olfativas son obligatorias"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    controller.create
);

cafeRouter.post(
    "/update",
    verifyToken,
    isSalesOrAdmin,
    body("id").notEmpty().withMessage("El ID es obligatorio"),
    body("nombre").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
    body("origen").optional().notEmpty().withMessage("El origen no puede estar vacío"),
    body("finca").optional().notEmpty().withMessage("La finca no puede estar vacía"),
    body("productor").optional().notEmpty().withMessage("El productor no puede estar vacío"),
    body("cantidad")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("La cantidad debe ser un número mayor a 0"),
    body("proceso").optional().notEmpty().withMessage("El proceso no puede estar vacío"),
    body("notasOlfativas").optional().notEmpty().withMessage("Las notas olfativas no pueden estar vacías"),
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

cafeRouter.delete("/:id", verifyToken, isAdmin, controller.delete);

export default cafeRouter;
