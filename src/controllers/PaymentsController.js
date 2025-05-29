import stripe from "stripe";

import { URL_FRONT } from "../config/index.js";
import ResponseDataBuilder from "../models/ResponseData.js";
import CartService from "../services/CartService.js";
import PaymentsService from "../services/PaymentsService.js";

class PaymentsController {
  constructor() {
    this.stripe = new stripe(process.env.STRIPE_SECRET_KEY);
    this.cartService = new CartService();
    this.paymentsService = new PaymentsService();
  }

  createPayment = async (req, res, next) => {
    const { currency, address } = req.body;

    const cartProducts = await this.cartService.getCart(req.id);
    const products = cartProducts.items.map((item) => {
      return {
        name: item.variety.product.name,
        price: item.variety.price,
        quantity: item.quantity,
        varietyId: item.varietyId,
      };
    });

    if (products.length === 0) {
      const response = new ResponseDataBuilder()
        .setStatus(400)
        .setMsg("No products in cart")
        .build();

      return res.status(response.status).json(response);
    }

    const DOLLAR_PRICE = 0.00024; // 0.00023 dollar = 1 peso cop

    const line_items = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: Math.floor((product.price / 4144.10) * 100), // in cents
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

      // create order  and invoice  in the db
      const { order, invoice } = await this.paymentsService.createDataPayment({
        session,
        products,
        userId: req.id,
        address,
      });

      const response = new ResponseDataBuilder()
        .setData({ session, order, invoice })
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

  webhook = async (req, res, next) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        next(err);
      }

      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }

    let status = "pending";
    let id = null;

    if (eventType === "checkout.session.completed") {
      console.log(`🔔  Payment received!`);
      id = data.object.id;
      status = "paid";
    } else if (eventType === "checkout.session.expired") {
      console.log(`🔔  Payment expired!`);
      id = data.object.id;
      status = "expired";
    } else if (eventType === "checkout.session.async_payment_succeeded") {
      console.log(`🔔  Payment succeeded!`);
      id = data.object.id;
      status = "paid";
    } else if (eventType === "checkout.session.async_payment_failed") {
      console.log(`🔔  Payment failed!`);
      id = data.object.id;
      status = "failed";
    }

    if (!id) {
      console.log(`🔔  No id found!`);
      return res.sendStatus(200);
    }

    try {
      await this.paymentsService.updateDataPayment(id, {
        status,
      });
    } catch (error) {
      console.error("Error updating payment:", error);
      return res.sendStatus(500);
    }

    res.sendStatus(200);
  };
}

export default PaymentsController;
