import dotenv from "dotenv";
import request from "supertest";
import app from "../app.js";

dotenv.config();

beforeEach(async () => {});

afterEach(async () => {});

describe("GET /api/products", () => {
  it("should return all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.products.length).toBeGreaterThan(0);
  });
});
