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
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *         description: Page number
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Status of the order
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: User ID of the order
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

  [
    query("page").optional().isInt(),
    query("status").optional().isIn(["paid", "pending", "expired", "failed"]),
    query("userId").optional().isString(),
  ],

  controller.getOrders
);

ordersRouter.get(
  "/count",

  verifyToken,
  isSalesOrAdmin,

  controller.getCount
);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     userId:
 *                       type: string
 *                     total:
 *                       type: number
 *                     status:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         name:
 *                           type: string
 *                     address:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         userId:
 *                           type: string
 *                         address:
 *                           type: string
 *                         city:
 *                           type: string
 *                         country:
 *                           type: string
 *                         postalCode:
 *                           type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           varietyId:
 *                             type: number
 *                           orderId:
 *                             type: number
 *                           quantity:
 *                             type: number
 *                           variety:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                               stock:
 *                                 type: number
 *                               weight:
 *                                 type: number
 *                               price:
 *                                 type: number
 *                               productId:
 *                                 type: number
 *                               product:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                   name:
 *                                     type: string
 *                                   description:
 *                                     type: string
 *                                   type:
 *                                     type: string
 *                                   status:
 *                                     type: boolean
 *                                   createdAt:
 *                                     type: string
 *                                   updatedAt:
 *                                     type: string
 */
ordersRouter.get(
  "/:id",

  verifyToken,

  [body("where").optional().isObject()],

  controller.getOrderById
);

export default ordersRouter;
