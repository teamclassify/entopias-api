import ResponseDataBuilder from "../models/ResponseData.js";
import validateBody from "../validators/validator.js";

class AuthController {
  constructor() {}

  getAll(req, res) {
    const data = new ResponseDataBuilder()
      .setData([])
      .setStatus(200)
      .setMsg("Products all")
      .build();

    res.json(data);
  }
}

export default AuthController;
