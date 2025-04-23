import cors from "cors";
import express from "express";
import { PORT } from "./config/index.js";
import swaggerDocs from "./config/swaggerConfig.js";
import handleErrors from "./middlewares/handleErrors.js";

import authRouter from "./routes/Auth.js";
import batchRouter from "./routes/Batches.js";
import cartRouter from "./routes/Cart.js";
import invoicesRouter from "./routes/Invoices.js";
import ordersRouter from "./routes/Orders.js";
import paymentsRouter from "./routes/Payments.js";
import producerRouter from "./routes/Producer.js";
import productsRouter from "./routes/Products.js";
import roleRoutes from "./routes/RoleRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import VarietyRouter from "./routes/Varieties.js";
import adressRoutes from "./routes/Address.js";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// We need the raw body to verify webhook signatures.
// Let's compute it only when hitting the Stripe webhook endpoint.
app.use(
  express.json({
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/api/payments/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use(express.urlencoded({ extended: true }));

app.get("/api", (_, res) => {
  res.json({ message: "Hello from server!" });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/batches", batchRouter);
app.use("/api/variedades", VarietyRouter);
app.use("/api/producers", producerRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/addresses", adressRoutes);

app.use(handleErrors);

swaggerDocs(app, PORT);

export default app;
