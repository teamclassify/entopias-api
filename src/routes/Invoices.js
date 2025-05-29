import express from "express";

import { body, query } from "express-validator";
import InvoicesController from "../controllers/InvoicesController.js";
import { isSalesOrAdmin } from "../middlewares/rbac.js";
import verifyToken from "../middlewares/verifyToken.js";
import ReportController from "../controllers/ReportController.js";

const invoicesRouter = express.Router();
const controller = new InvoicesController();
const reportController = new ReportController();

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoices management
 *
 * /invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoices fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoices:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           orderId:
 *                             type: number
 *                           transactionId:
 *                             type: string
 *                           bank:
 *                             type: string
 *                           status:
 *                             type: string
 *                           date:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           order:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                               userId:
 *                                 type: string
 *                               total:
 *                                 type: number
 *                               status:
 *                                 type: string
 *                               createdAt:
 *                                 type: string
 *                               user:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   email:
 *                                     type: string
 *                                   createdAt:
 *                                     type: string
 *                                   gender:
 *                                     type: string
 *                                   phone:
 *                                     type: string
 *                                   photo:
 *                                     type: string
 *                                     nullable: true
 *                                   updatedAt:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                                   birthday:
 *                                     type: string
 *                                     nullable: true
 *                               items:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: number
 *                                     varietyId:
 *                                       type: number
 *                                     orderId:
 *                                       type: number
 *                                     quantity:
 *                                       type: number
 *                                     variety:
 *                                       type: object
 *                                       properties:
 *                                         id:
 *                                           type: number
 *                                         stock:
 *                                           type: number
 *                                         weight:
 *                                           type: number
 *                                         price:
 *                                           type: number
 *                                         productId:
 *                                           type: number
 *                                         product:
 *                                           type: object
 *                                           properties:
 *                                             id:
 *                                               type: number
 *                                             name:
 *                                               type: string
 *                                             description:
 *                                               type: string
 *                                             type:
 *                                               type: string
 *                                             status:
 *                                               type: boolean
 *                                             createdAt:
 *                                               type: string
 *                                             updatedAt:
 *                                               type: string
 *                     count:
 *                       type: number
 *                 error:
 *                   type: null
 *                 status:
 *                   type: number
 *                 timestamp:
 *                   type: string
 *                 msg:
 *                   type: string
 */
invoicesRouter.get(
  "/",

  verifyToken,
  isSalesOrAdmin,

  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("status").optional().isIn(["pending", "paid", "failed", "canceled"]),
    query("userId").optional().isString(),
  ],

  controller.getInvoices
);

/**
 * @swagger
 * /invoices/recent:
 *   get:
 *     summary: Obtener las últimas facturas registradas
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Últimas facturas obtenidas correctamente
 */

invoicesRouter.get(
  "/recent",
  verifyToken,
  isSalesOrAdmin,
  controller.getRecentInvoices
);


/**
 * @swagger
 * /invoices/report:
 *   get:
 *     summary: Generar un reporte en PDF de las facturas
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de inicio del reporte (formato YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de fin del reporte (formato YYYY-MM-DD)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 500
 *         required: false
 *         description: Límite de facturas a incluir en el reporte
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error al generar el reporte
 */
invoicesRouter.get("/report", 
  (req, res, next) => { console.log("[1] --> Entró a invoicesRouter"); next(); },
  verifyToken,
  (req, res, next) => { console.log("[2] --> Pasó verifyToken"); next(); },
  isSalesOrAdmin, 
  [
    query("from").optional().isISO8601().toDate(),
    query("to").optional().isISO8601().toDate(),
    query("limit").optional().isInt({ min: 1, max: 500 }).toInt(),
  ],
  (req, res, next) => {
    console.log(">>> Entró a /report");
    console.log("holaaa");  
    reportController.generatePdf(req, res, next);
  }
);

export default invoicesRouter;
