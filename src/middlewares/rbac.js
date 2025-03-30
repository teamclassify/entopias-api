import ResponseDataBuilder from "../models/ResponseData.js";
import UserService from "../services/UserService.js";

export const isAdmin = async (req, res, next) => {
  const userService = new UserService();

  try {
    const { roles } = await userService.findOne(req.id);

    const adminRole = roles.find((role) => role.roleId === 0);
    if (adminRole) {
      next();
      return;
    }

    const response = new ResponseDataBuilder()
      .setData(null)
      .setStatus(403)
      .setError(true)
      .setMsg("Requiere rol de administrador!")
      .build();
    res.status(403).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isSales = async (req, res, next) => {
  const userService = new UserService();

  try {
    const { roles } = await userService.findOne(req.id);

    const modRole = roles.find((role) => role.roleId === 1);
    if (modRole) {
      next();
      return;
    }

    const response = new ResponseDataBuilder()
      .setData(null)
      .setStatus(403)
      .setError(true)
      .setMsg("Requiere rol de asistente!")
      .build();
    res.status(403).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isSalesOrAdmin = async (req, res, next) => {
  const userService = new UserService();

  try {
    const { roles } = await userService.findOne(req.id);

    const hasRole = roles.some((role) => [0, 1].includes(role.roleId));
    if (hasRole) {
      next();
      return;
    }

    const response = new ResponseDataBuilder()
      .setData(null)
      .setStatus(403)
      .setError(true)
      .setMsg("Requiere rol de asistente o administrador!")
      .build();

    res.status(403).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
