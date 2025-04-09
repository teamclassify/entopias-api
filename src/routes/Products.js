import express from "express";
import { body } from "express-validator";
import multer from "multer";

import ProductController from "../controllers/ProductController.js";
import { isAdmin, isSalesOrAdmin } from "../middlewares/rbac.js";
import verifyToken from "../middlewares/verifyToken.js";

const productRouter = express.Router();
const controller = new ProductController();
const upload = multer({});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       type:
 *                         type: string
 *                       varieties:
 *                         type: array
 *                       photos:
 *                         type: array
 *                         items:
 *                           type: string
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Productos obtenidos exitosamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-20T15:30:00.000Z"
 */
productRouter.get("/", controller.getAll);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     type:
 *                       type: string
 *                     varieties:
 *                       type: array
 *                     photos:
 *                       type: array
 *                       items:
 *                         type: string
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Producto encontrado exitosamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-20T15:30:00.000Z"
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: null
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 404
 *                 msg:
 *                   type: string
 *                   example: "Producto no encontrado"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-20T15:30:00.000Z"
 */
productRouter.get("/:id", controller.getOne);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: photos
 *         type: file
 *         description: Fotos del producto (máximo 5)
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - type
 *               - varieties
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               varieties:
 *                 type: array
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     type:
 *                       type: string
 *                     varieties:
 *                       type: array
 *                     photos:
 *                       type: array
 *                       items:
 *                         type: string
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 201
 *                 msg:
 *                   type: string
 *                   example: "Producto creado exitosamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-20T15:30:00.000Z"
 */
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

/**
 * @swagger
 * /products/{id}:
 *   post:
 *     summary: Actualiza un producto existente
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar
 *       - in: formData
 *         name: newphotos
 *         type: file
 *         description: Nuevas fotos del producto (máximo 5)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - status
 *               - type
 *               - varieties
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: boolean
 *               type:
 *                 type: string
 *               varieties:
 *                 type: array
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     type:
 *                       type: string
 *                     varieties:
 *                       type: array
 *                     photos:
 *                       type: array
 *                       items:
 *                         type: string
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Producto actualizado exitosamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-20T15:30:00.000Z"
 */
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

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Elimina un producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: null
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Producto eliminado exitosamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-20T15:30:00.000Z"
 */
productRouter.delete("/:id", verifyToken, isAdmin, controller.delete);

export default productRouter;
