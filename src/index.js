import cors from "cors";
import express from "express";
import { PORT } from "./config/index.js";

import authRouter from "./routes/Auth.js";

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

app.listen(PORT, () => {
  console.log(`Server start with port ${PORT}`);
});
