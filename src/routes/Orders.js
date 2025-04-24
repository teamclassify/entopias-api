import express from "express";

import { body, query } from "express-validator";
import OrderController from "../controllers/OrderController.js";
import { isSalesOrAdmin } from "../middlewares/rbac.js";
import verifyToken from "../middlewares/verifyToken.js";

const ordersRouter = express.Router();
const controller = new OrderController();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           userId:
 *                             type: string
 *                           total:
 *                             type: number
 *                           status:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                               createdAt:
 *                                 type: string
 *                               gender:
 *                                 type: string
 *                               phone:
 *                                 type: string
 *                               photo:
 *                                 type: string
 *                                 nullable: true
 *                               updatedAt:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               birthday:
 *                                 type: string
 *                                 nullable: true
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: number
 *                                 varietyId:
 *                                   type: number
 *                                 orderId:
 *                                   type: number
 *                                 quantity:
 *                                   type: number
 *                                 variety:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: number
 *                                     stock:
 *                                       type: number
 *                                     weight:
 *                                       type: number
 *                                     price:
 *                                       type: number
 *                                     productId:
 *                                       type: number
 *                                     product:
 *                                       type: object
 *                                       properties:
 *                                         id:
 *                                           type: number
 *                                         name:
 *                                           type: string
 *                                         description:
 *                                           type: string
 *                                         type:
 *                                           type: string
 *                                         status:
 *                                           type: boolean
 *                                         createdAt:
 *                                           type: string
 *                                         updatedAt:
 *                                           type: string
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
ordersRouter.get(
  "/",

  verifyToken,
  isSalesOrAdmin,

  [query("page").optional().isInt(), body("where").optional().isObject()],

  controller.getOrders
);

ordersRouter.get(
  "/count",
  verifyToken,
  isSalesOrAdmin,
  controller.getCount.bind(controller)
)


export default ordersRouter;
