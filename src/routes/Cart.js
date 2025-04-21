import express from "express";

import CartController from "../controllers/CartController.js";
import verifyToken from "../middlewares/verifyToken.js";

const cartRouter = express.Router();
const controller = new CartController();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 *
 * /cart:
 *   get:
 *     summary: Get the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart found
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
 *                     userId:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           varietyId:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                           variety:
 *                             type: object
 *                             properties:
 *                               id:    
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                               price:
 *                                 type: number
 *                               stock:
 *                                 type: number
 *                               product:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                                   description:
 *                                     type: string
 *                                   photos:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         id:
 *                                           type: string
 *                                         url:
 *                                           type: string
 */
cartRouter.get("/", verifyToken, controller.getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               varietyId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product added to cart
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
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
 *                 msg:
 *                   type: string
 */
cartRouter.post("/", verifyToken, controller.addProductToCart);

export default cartRouter;
