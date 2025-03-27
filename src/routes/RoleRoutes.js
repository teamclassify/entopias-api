import express from "express";
import RoleController from "../controllers/RoleController.js";

const router = express.Router();

router.get("/", RoleController.getAllRoles);
router.get("/:id", RoleController.getRoleById);
router.post("/", RoleController.createRole);
router.put("/:id", RoleController.updateRole);
router.delete("/:id", RoleController.deleteRole);

export default router;
