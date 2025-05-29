import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { PORT } from "./config/index.js";

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
