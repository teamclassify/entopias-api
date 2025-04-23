import express, { query } from "express";
import { body, validationResult } from "express-validator";

import AddressController from "../controllers/AddressController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();
const controller = new AddressController();

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Endpoints para gestionar direcciones de envío
 */

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Obtiene todas las direcciones del usuario autenticado
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Direcciones obtenidas con éxito
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
 *                         type: integer
 *                       address:
 *                         type: string
 *                       city:
 *                         type: string
 *                       country:
 *                         type: string
 *                       postalCode:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 error:
 *                   type: boolean
 *                 status:
 *                   type: integer
 *                 msg:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get(
  "/",

  verifyToken,

  controller.getAll
);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: Obtiene una dirección por ID
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la dirección
 *     responses:
 *       200:
 *         description: Dirección encontrada
 *       404:
 *         description: Dirección no encontrada
 */
router.get("/:id", verifyToken, controller.getOne);

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Crea una nueva dirección
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - country
 *               - postalCode
 *               - address
 *             properties:
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dirección creada con éxito
 *       400:
 *         description: Error de validación o dirección duplicada
 */
router.post(
  "/",

  verifyToken,

  [
    body("address")
      .notEmpty()
      .withMessage("Address is required")
      .isString()
      .withMessage("Address must be a string"),
    body("city")
      .notEmpty()
      .withMessage("City is required")
      .isString()
      .withMessage("City must be a string"),
    body("country")
      .notEmpty()
      .withMessage("Country is required")
      .isString()
      .withMessage("Country must be a string"),
    body("postalCode")
      .notEmpty()
      .withMessage("Postal code is required")
      .isString()
      .withMessage("Postal code must be a string"),
  ],

  controller.create
);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Actualiza una dirección existente
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la dirección
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dirección actualizada con éxito
 *       400:
 *         description: Error de validación o dirección duplicada
 *       404:
 *         description: Dirección no encontrada o no te pertenece
 */
router.put(
  "/:id",

  verifyToken,

  [
    body("address")
      .notEmpty()
      .withMessage("Address is required")
      .isString()
      .withMessage("Address must be a string"),
    body("city")
      .notEmpty()
      .withMessage("If provided, city cannot be empty")
      .isString()
      .withMessage("City must be a string"),
    body("country")
      .notEmpty()
      .withMessage("If provided, country cannot be empty")
      .isString()
      .withMessage("Country must be a string"),
    body("postalCode")
      .notEmpty()
      .withMessage("If provided, postal code cannot be empty")
      .isString()
      .withMessage("Postal code must be a string"),
  ],

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { city, country, postalCode } = req.body;
    if (
      city === undefined &&
      country === undefined &&
      postalCode === undefined
    ) {
      return res.status(400).json({
        error:
          "At least one field (city, country, postalCode) must be provided for update",
      });
    }
    next();
  },

  controller.update
);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Elimina una dirección
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la dirección a eliminar
 *     responses:
 *       200:
 *         description: Dirección eliminada con éxito
 *       404:
 *         description: Dirección no encontrada o no te pertenece
 */
router.delete("/:id", verifyToken, controller.delete);

export default router;
