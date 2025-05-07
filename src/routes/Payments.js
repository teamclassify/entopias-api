import express from "express";
import { body, param } from "express-validator";

import PaymentsController from "../controllers/PaymentsController.js";
import verifyToken from "../middlewares/verifyToken.js";

const paymentsRouter = express.Router();
const controller = new PaymentsController();

/**
 * @swagger
 * /api/payments/get-payment/{session_id}:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Get a payment
 *     description: Get a payment by session ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID to get the payment for
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
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
 *                   example: "Payment retrieved successfully"
 *                 data:
 *                   type: object
 *                   description: Stripe Payment object
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error while retrieving payment
 */
paymentsRouter.get(
  "/get-payment/:session_id",

  verifyToken,

  [
    param("session_id")
      .notEmpty()
      .withMessage("El ID de la sesión es requerido."),
  ],

  controller.getPayment
);

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
 *               - currency
 *             properties:
 *               currency:
 *                 type: string
 *                 description: The currency to charge for
 *                 example: "usd"
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
    body("currency").notEmpty().withMessage("La moneda es requerida."),
    body("address").notEmpty().withMessage("La dirección es requerida."),
  ],

  controller.createPayment
);

paymentsRouter.post("/webhook", controller.webhook);

export default paymentsRouter;
