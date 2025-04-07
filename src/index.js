import cors from "cors";
import express from "express";
import { PORT } from "./config/index.js";
import handleErrors from "./middlewares/handleErrors.js";
import swaggerDocs from "./config/swaggerConfig.js";

import authRouter from "./routes/Auth.js";
import productsRouter from "./routes/Products.js";
import userRoutes from "./routes/UserRoutes.js";
import roleRoutes from "./routes/RoleRoutes.js";
import cafeRouter from "./routes/Cafes.js";
import lotesRouter from "./routes/Lotes.js"
import productorRouter from "./routes/ProductorRoutes.js";
import variedadRoutes from "./routes/Variedades.js";


const app = express();

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

app.get("/api", (_, res) => {
  res.json({ message: "Hello from server!" });
});

// ROUTES

// New routes
// import nameRouter from "./routes/NameRouter.js";
// app.use("/api/name-endpoint", nameRouter);

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/users",userRoutes);
app.use("/api/roles",roleRoutes);
app.use("/api/cafes", cafeRouter);
app.use("/api/lotes", lotesRouter);
app.use("/api/productores",productorRouter);
app.use("/api/variedades",variedadRoutes);

app.use(handleErrors);

swaggerDocs(app,PORT);

app.listen(PORT, () => {
  console.log(`Server start with port ${PORT}`);
  console.log(`Documentación en http://localhost:${PORT}/api-docs`);
});
