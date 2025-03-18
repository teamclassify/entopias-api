import { validationResult } from "express-validator";
import ResponseDataBuilder from "../models/ResponseData.js";

export default function validateBody(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const data = new ResponseDataBuilder()
      .setData(null)
      .setStatus(400)
      .setMsg("Validation error")
      .setError(errors.array().map((error) => error.msg))
      .build();

    return res.status(400).json(data);
  }

  return null;
}
