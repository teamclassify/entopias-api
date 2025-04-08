import cors from "cors";
import express from "express";
import { PORT } from "./config/index.js";
import swaggerDocs from "./config/swaggerConfig.js";
import handleErrors from "./middlewares/handleErrors.js";

import authRouter from "./routes/Auth.js";
import cafeRouter from "./routes/Cafes.js";
import productsRouter from "./routes/Products.js";
import roleRoutes from "./routes/RoleRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import batchRouter from "./routes/Batches.js";
import VarietyRouter from "./routes/Varieties.js";
import producerRouter from "./routes/Producer.js";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (_, res) => {
  res.json({ message: "Hello from server!" });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/lotes", batchRouter);
app.use("/api/variedades", VarietyRouter);
app.use("/api/productores", producerRouter);

app.use(handleErrors);

swaggerDocs(app, PORT);

export default app;
