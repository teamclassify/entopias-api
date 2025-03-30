import cors from "cors";
import express from "express";
import { PORT } from "./config/index.js";
import handleErrors from "./middlewares/handleErrors.js";

import authRouter from "./routes/Auth.js";
import productsRouter from "./routes/Products.js";
import cafeRouter from "./routes/Cafes.js";
import lotesRouter from "./routes/Lotes.js"

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
app.use("/api/cafes", cafeRouter);
app.use("/api/lotes", lotesRouter);

app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Server start with port ${PORT}`);
});
