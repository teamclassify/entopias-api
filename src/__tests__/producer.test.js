import dotenv from "dotenv";
import request from "supertest";
import app from "../app.js";

let token;

dotenv.config();

beforeEach(async () => {
   token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxMTE1MjM1YTZjNjE0NTRlZmRlZGM0NWE3N2U0MzUxMzY3ZWViZTAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQW5kcmVzIFBhcnJhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tFNVBHU1dHSTVIa0VBdzd2MTg3OV9OZHB0SlB0ZnhiM2kxbkxhVFMyQTM2Q1FVbDR2PXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2VudG9waWFzIiwiYXVkIjoiZW50b3BpYXMiLCJhdXRoX3RpbWUiOjE3NDQyOTM3OTcsInVzZXJfaWQiOiJWVkxubmVaVWlhY3pDVXZ5Rmx1YzAxQjcwcjEyIiwic3ViIjoiVlZMbm5lWlVpYWN6Q1V2eUZsdWMwMUI3MHIxMiIsImlhdCI6MTc0NDI5MzgwNywiZXhwIjoxNzQ0Mjk3NDA3LCJlbWFpbCI6ImJ5YW5kcmV2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTAzMTc3MzMzNzk5MDIzMTQ0MDY2Il0sImVtYWlsIjpbImJ5YW5kcmV2QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.MzUgIqtHn2YUOQC9n5hS_3zn2UtqSgC2dDrNPwlMDpUe-Xo3gFT_JEgRYHDa8uxAZcfK-ImMnm5S7hPn1U3XoFYYzxij1MOFrXHSzwUdJ3j7z1IcEp5Mggk_6mMHxVBG0I_A50NtoShsy2EJCPyA89msKbCNw-ri6O4gBFLOTFI2j5b1IekUPgiWMaZNLA8sqtBZ9e28tkc6dMBwBgMrBxfRQA4tBkz5pg9-3bs9YlniR_UI_RseUe8VzccJ6r33ZNBwezky_Vx_qkF2Zcb29E5h7PkNLjq8Quo5mwp5jwM_FNchjsZAPrq7fPXCaXszGa4F2BHLF7y_Y27tQNUJxw";
});

afterEach(async () => {});

describe("GET /api/productores", () => {
  it("should return all productores", async () => {
    const res = await request(app)
      .get("/api/productores")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.producers.length).toBeGreaterThan(0);
  });
});

describe("GET /api/productores/1", () => {
    it("should return one product", async () => {
      const res = await request(app)
        .get("/api/productores/1")
        .set("Authorization", `Bearer ${token}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.body.data).not.toBe(null);
    });
  });
  
