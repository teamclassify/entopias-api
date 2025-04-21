import stripe from "stripe";

import { URL_FRONT } from "../config/index.js";
import ResponseDataBuilder from "../models/ResponseData.js";

class PaymentsController {
  constructor() {
    this.stripe = new stripe(process.env.STRIPE_SECRET_KEY);
  }

  createPayment = async (req, res, next) => {
    const { products, currency } = req.body;

    const line_items = products.map((product) => ({
      price_data: {
        currency: currency || "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100, // in cents
      },
      quantity: product.quantity,
    }));

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        ui_mode: "embedded",
        line_items,
        return_url: `${URL_FRONT}/pagos/exitoso?session_id={CHECKOUT_SESSION_ID}`,
      });

      const response = new ResponseDataBuilder()
        .setData(session)
        .setStatus(200)
        .setMsg("Session created successfully")
        .build();

      res.status(response.status).json(response);
    } catch (error) {
      console.error("Error creating session in stripe:", error);
      next(error);
    }
  };

  getPayment = async (req, res, next) => {
    const { session_id } = req.params;

    console.log("session_id", session_id);

    try {
      const session = await this.stripe.checkout.sessions.retrieve(session_id);

      if (!session) {
        const response = new ResponseDataBuilder()
          .setStatus(404)
          .setMsg("El pago no se pudo crear")
          .build();

        return res.status(response.status).json(response);
      }

      const response = new ResponseDataBuilder()
        .setData(session)
        .setStatus(200)
        .setMsg("El pago se creo correctamente")
        .build();

      return res.status(response.status).json(response);
    } catch (error) {
      console.error("Error getting payment:", error);
      next(error);
    }
  };
}

export default PaymentsController;
