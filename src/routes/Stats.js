import express from "express";
import { query, validationResult } from "express-validator";

import StatsController from "../controllers/StatsController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();
const controller = new StatsController();

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: Endpoints para obtener estadísticas de ventas
 */

/**
 * @swagger
 * /stats/top-sales-varieties:
 *   get:
 *     summary: Obtiene las variedades más vendidas
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Límite de resultados
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Orden de los resultados
 *     responses:
 *       200:
 *         description: Variedades obtenidas con éxito
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
 *                       stock:
 *                         type: integer
 *                       weight:
 *                         type: number
 *                       price:
 *                         type: number
 *                       productId:
 *                         type: integer
 *                       revenue:
 *                         type: number
 *                       productName:
 *                         type: string
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: number
 *                           status:
 *                             type: boolean
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
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
  "/top-sales-varieties",
  verifyToken,
  [
    query("startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid ISO 8601 date"),
    query("endDate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid ISO 8601 date"),
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer"),
    query("order")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Order must be 'asc' or 'desc'"),
  ],
  controller.getTopSalesVarieties
);

/**
 * @swagger
 * /stats/top-sales-product:
 *   get:
 *     summary: Obtiene los productos más vendidos
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Límite de resultados
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Orden de los resultados
 *     responses:
 *       200:
 *         description: Variedades obtenidas con éxito
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
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       soldCount:
 *                         type: integer
 *                       varieties:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                            id:
 *                              type: integer
 *                            stock:
 *                             type: integer
 *                            weight:
 *                             type: number
 *                            price:
 *                              type: number
 *                            productId:
 *                              type: integer
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
  "/top-sales-product",
  verifyToken,
  [
    query("startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid ISO 8601 date"),
    query("endDate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid ISO 8601 date"),
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer"),
    query("order")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Order must be 'asc' or 'desc'"),
  ],
  controller.getTopSalesProduct
);

/**
 * @swagger
 * /stats/most-profitable-varieties:
 *   get:
 *     summary: Obtiene las variedades más rentables
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Límite de resultados
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Orden de los resultados
 *     responses:
 *       200:
 *         description: Variedades obtenidas con éxito
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
 *                       stock:
 *                         type: integer
 *                       weight:
 *                         type: number
 *                       price:
 *                         type: number
 *                       productId:
 *                         type: integer
 *                       revenue:
 *                         type: number
 *                       productName:
 *                         type: string
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: number
 *                           status:
 *                             type: boolean
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
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
  "/most-profitable-varieties",
  verifyToken,
  [
    query("startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid ISO 8601 date"),
    query("endDate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid ISO 8601 date"),
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer"),
    query("order")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Order must be 'asc' or 'desc'"),
  ],
  controller.getMostProfitableVarieties
);

export default router;