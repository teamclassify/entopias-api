import express from "express";
import { query, validationResult } from "express-validator";

import CustomerStatsController from "../controllers/CustomerStatsController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();
const controller = new CustomerStatsController();

/**
 * @swagger
 * tags:
 *   name: Customer Statistics
 *   description: Endpoints para obtener estadísticas de clientes
 */

router.get("/total-customers", verifyToken, controller.getTotalCustomers);

/**
 * @swagger
 * /customer-stats/registered-monthly:
 *   get:
 *     summary: Obtiene el número de clientes registrados por mes
 *     tags: [Customer Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *         description: Número de meses a consultar
 *     responses:
 *       200:
 *         description: Clientes registrados por mes obtenidos con éxito
 */
router.get(
  "/registered-monthly",
  verifyToken,
  [
    query("months")
      .optional()
      .isInt({ min: 1, max: 24 })
      .withMessage("Months must be an integer between 1 and 24"),
  ],
  controller.getCustomersRegisteredMonthly
);

/**
 * @swagger
 * /customer-stats/with-orders:
 *   get:
 *     summary: Obtiene la cantidad de clientes que han hecho al menos una compra
 *     tags: [Customer Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clientes con compras obtenidos con éxito
 */
router.get("/with-orders", verifyToken, controller.getCustomersWithOrders);

/**
 * @swagger
 * /customer-stats/top-spenders:
 *   get:
 *     summary: Obtiene los clientes que más han gastado
 *     tags: [Customer Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de clientes a devolver
 *     responses:
 *       200:
 *         description: Top clientes por gasto obtenidos con éxito
 */
router.get(
  "/top-spenders",
  verifyToken,
  [
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer"),
  ],
  controller.getTopSpenders
);

/**
 * @swagger
 * /customer-stats/by-city:
 *   get:
 *     summary: Obtiene la cantidad de clientes agrupados por ciudad
 *     tags: [Customer Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clientes agrupados por ciudad obtenidos con éxito
 */
router.get("/by-city", verifyToken, controller.getCustomersByCity);

/**
 * @swagger
 * /customer-stats/by-country:
 *   get:
 *     summary: Obtiene la cantidad de clientes agrupados por país
 *     tags: [Customer Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clientes agrupados por país obtenidos con éxito
 */
router.get("/by-country", verifyToken, controller.getCustomersByCountry);

/**
 * @swagger
 * /customer-stats/unpaid-invoices:
 *   get:
 *     summary: Obtiene la cantidad de clientes con facturas pendientes de pago
 *     tags: [Customer Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clientes con facturas impagas obtenidos con éxito
 */
router.get("/unpaid-invoices", verifyToken, controller.getCustomersWithPendingInvoices);

export default router;
