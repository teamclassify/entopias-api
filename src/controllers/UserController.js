import ResponseDataBuilder from "../models/ResponseData.js";
import UserService from "../services/UserService.js";
import validateBody from "../validators/validator.js";

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const users = await new UserService().find();

      const data = new ResponseDataBuilder()
        .setData(users)
        .setStatus(200)
        .setMsg("Usuarios encontrados")
        .build();

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const user = await new UserService().findOne(req.params.id);

      if (!user) {
        const data = new ResponseDataBuilder()
          .setData(null)
          .setStatus(404)
          .setMsg("Usuario no encontrado")
          .build();

        return res.status(404).json(data);
      }

      const data = new ResponseDataBuilder()
        .setData(user)
        .setStatus(200)
        .setMsg("Usuario encontrado")
        .build();

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async createUser(req, res) {
    try {
      const user = await new UserService().create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req, res, next) {
    if (validateBody(req, res)) {
      return;
    }

    try {
      const user = await new UserService().update(req.id, req.body);

      const data = new ResponseDataBuilder()
        .setData(user)
        .setStatus(200)
        .setMsg("User updated")
        .build();

      res.json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteUser(req, res) {
    try {
      await new UserService().delete(req.params.id);
      res.json({ message: "Usuario eliminado" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
