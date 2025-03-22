import ResponseDataBuilder from "../models/ResponseData.js";
import AuthService from "../services/UserService.js";
import validateBody from "../validators/validator.js";

class AuthController {
  constructor() {
    this.userService = new AuthService();
  }

  login = async (req, res, next) => {
    const id = req.id;

    if (!id) {
      const data = new ResponseDataBuilder()
        .setData(null)
        .setStatus(401)
        .setMsg("Unauthorized")
        .build();

      return res.json(data);
    }

    if (validateBody(req, res)) {
      return;
    }

    const user = await this.userService.findOne(id);

    if (user) {
      // get user from db and return it
      const data = new ResponseDataBuilder()
        .setData(user)
        .setStatus(200)
        .setMsg("User found")
        .build();

      res.json(data);
    } else {
      // create user in db and return it
      try {
        const userCreated = await this.userService.create({
          id: id,
          name: req.body.name,
          email: req.body.email,
          photo: req.body.photo ?? null,
          phone: req.body.phone ?? null,
          gender: "na",
          role: req.body.role === "sales" ? "sales" : "user",
        });

        const data = new ResponseDataBuilder()
          .setData(userCreated)
          .setStatus(201)
          .setMsg("User created")
          .build();

        res.json(data);
      } catch (err) {
        console.log(err);
        next(err);
      }
    }
  };

  me = async (req, res) => {
    const id = req.id;

    if (!id) {
      const data = new ResponseDataBuilder()
        .setData(null)
        .setStatus(401)
        .setMsg("Unauthorized")
        .build();

      return res.json(data);
    }

    const user = await this.userService.findOne(id);

    if (user) {
      const data = new ResponseDataBuilder()
        .setData(user)
        .setStatus(200)
        .setMsg("User found")
        .build();

      res.json(data);
    } else {
      const data = new ResponseDataBuilder()
        .setData(null)
        .setStatus(404)
        .setMsg("User not found")
        .build();

      res.json(data);
    }
  };
}

export default AuthController;
