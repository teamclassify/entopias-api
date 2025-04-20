import express from "express";
import { body } from "express-validator";

import PaymentsController from "../controllers/PaymentsController.js";
import verifyToken from "../middlewares/verifyToken.js";

const paymentsRouter = express.Router();
const controller = new PaymentsController();

/**
 * @swagger
 * /api/payments/create-payment-intent:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a payment intent
 *     description: Creates a new payment intent using Stripe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               currency:
 *                 type: string
 *                 description: The currency to charge for
 *                 example: "usd"
 *               products:
 *                 type: array
 *                 description: The products to charge for
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The product ID
 *                     quantity:
 *                       type: number
 *                       description: The quantity of the product
 *                     price:
 *                       type: number
 *                       description: The price of the product
 *                     name:
 *                       type: string
 *                       description: The name of the product
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Payment intent created successfully"
 *                 data:
 *                   type: object
 *                   description: Stripe PaymentIntent object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: The URL to redirect to
 *                       example: "https://checkout.stripe.com/c/pay/1234567890"
 *                     clientSecret:
 *                       type: string
 *                       description: The client secret to use for the payment
 *                       example: "1234567890"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error while creating payment intent
 */

paymentsRouter.post(
  "/create-checkout-session",

  verifyToken,

  [
    body("products").notEmpty().withMessage("Los productos son requeridos."),
    body("currency").notEmpty().withMessage("La moneda es requerida."),
  ],

  controller.createPayment
);

export default paymentsRouter;