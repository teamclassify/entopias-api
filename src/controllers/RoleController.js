import RoleService from "../services/RoleService.js";

class RoleController {
  static async getAllRoles(req, res) {
    try {
      const roles = await new RoleService().find();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRoleById(req, res) {
    try {
      const role = await new RoleService().findOne(req.params.id);
      if (!role) return res.status(404).json({ message: "Rol no encontrado" });
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createRole(req, res) {
    try {
      const role = await new RoleService().create(req.body);
      res.status(201).json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateRole(req, res) {
    try {
      const role = await new RoleService().update(req.params.id, req.body);
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteRole(req, res) {
    try {
      await new RoleService().delete(req.params.id);
      res.json({ message: "Rol eliminado" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default RoleController;
