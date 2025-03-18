import dotenv from "dotenv";

dotenv.config();

const PAGINATION_LIMIT = 10;
const PORT = process.env.PORT || 8080;
const MODE = process.env.MODE || "dev";
const URL_FRONT = process.env.URL_FRONT;

export { MODE, PAGINATION_LIMIT, PORT, URL_FRONT };
