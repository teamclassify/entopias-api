import authApp from "../config/firebase.js";
import ResponseDataBuilder from "../models/ResponseData.js";
import CartService from "../services/CartService.js";
import AuthService from "../services/UserService.js";
import sendEmail from "../utils/sendEmail.js";
import validateBody from "../validators/validator.js";

class AuthController {
  constructor() {
    this.userService = new AuthService();
    this.cartService = new CartService();
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
        const birthday = req.body.birthday ? new Date(req.body.birthday) : null;

        const userCreated = await this.userService.create({
          id: id,
          name: req.body.name,
          email: req.body.email,
          photo: req.body.photo ?? null,
          phone: req.body.phone ?? null,
          birthday,
          gender: "na",
          role: req.body.role === "sales" ? "sales" : "user",
        });

        // create cart for user
        await this.cartService.createCart({ userId: id });

        // send email to user
        await sendEmail({
          to: req.body.email,
          subject: "Bienvenido a Entopias Cafe",
          message: `Hola ${req.body.name}, bienvenido a Entopias Cafe, tu cuenta ha sido creada con exito.`,
        }).catch((err) => {
          console.log(err);
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

  register = async (req, res, next) => {
    if (validateBody(req, res)) {
      return;
    }

    const { name, email, password, phone } = req.body;

    try {
      const userCreated = await authApp.createUser({
        displayName: name,
        email,
        password,
        emailVerified: true,
      });

      if (userCreated) {
        const userCreatedInDB = await this.userService.create({
          id: userCreated.uid,
          name: name,
          email: email,
          photo: null,
          phone: phone ?? null,
          gender: "na",
          role: "sales",
        });

        // create cart for user
        await this.cartService.createCart({ userId: userCreated.uid });

        if (!userCreatedInDB) {
          const data = new ResponseDataBuilder()
            .setData(null)
            .setStatus(400)
            .setMsg("User not created")
            .build();

          res.status(400).json(data);
          return;
        }

        // send email to user
        await sendEmail({
          to: email,
          subject: "Bienvenido a Entopias Cafe",
          message: `Hola ${name}, bienvenido a Entopias Cafe, tu cuenta ha sido creada con exito.`,
        }).catch((err) => {
          console.log(err);
        });

        const data = new ResponseDataBuilder()
          .setData(userCreatedInDB)
          .setStatus(201)
          .setMsg("User created")
          .build();

        res.status(201).json(data);
        return;
      }

      const data = new ResponseDataBuilder()
        .setData(null)
        .setStatus(400)
        .setMsg("User not created")
        .build();

      res.status(400).json(data);
    } catch (err) {
      console.log(err);
      next(err);
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
