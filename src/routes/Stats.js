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
 * /stats/top-profitable-varieties:
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
  "/top-profitable-varieties",
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
  controller.getTopProfitableVarieties
);

/**
 * @swagger
 * /stats/total-orders:
 *   get:
 *     summary: Obtiene el total de pedidos
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total de pedidos obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: integer
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
  "/total-orders",
  verifyToken,
  controller.getTotalOrders
);

/**
 * @swagger
 * /stats/orders-by-date:
 *   get:
 *     summary: Obtiene los pedidos por fecha
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
 *     responses:
 *       200:
 *         description: Pedidos obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     revenue:
 *                       type: number
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
  "/total-revenue-by-date",
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
  ],
  controller.getTotalRevenueByDate
);

/**
 * @swagger
 * /stats/group-orders-by-status:
 *   get:
 *     summary: Obtiene los pedidos agrupados por estado
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pedidos agrupados obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     ordersByStatus:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           status:
 *                             type: string
 *                           count:
 *                             type: object
 *                             properties:
 *                              status:
 *                                type: integer
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
  "/group-orders-by-status",
  verifyToken,
  controller.getGroupOrdersByStatus
);


/**
 * @swagger
 * /stats/group-invoice-by-bank:
 *   get:
 *     summary: Obtiene las facturas agrupadas por banco
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Facturas agrupadas obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoicesByBank:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           bank:
 *                             type: string
 *                           count:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               amount:
 *                                 type: number
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
  "/group-invoice-by-bank",
  verifyToken,
  controller.getGroupInvoiceByBank
);


/**
 * @swagger
 * /stats/average-order-value:
 *   get:
 *     summary: Obtiene el valor promedio de los pedidos
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
 *     responses:
 *       200:
 *         description: Valor promedio obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     averageOrderValue:
 *                       type: number
 *                 error:
 *                   type: boolean
 *                 status:
 *                   type: integer
 *                 msg:
 *                   type: string
 */
router.get(
  "/average-order-value",
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
  ],
  controller.getAverageOrderValue
);

/**
 * @swagger
 * /stats/average-products-per-order:
 *   get:
 *     summary: Obtiene el promedio de productos por pedido
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
 *     responses:
 *       200:
 *         description: Promedio obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     averageProductsPerOrder:
 *                       type: number
 */

router.get(
  "/average-products-per-order",
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
  ],
  controller.getAverageProductsPerOrder
);

export default router;