import express from "express";
import { body } from "express-validator";
import UserController from "../controllers/UserController.js";
import { isAdmin, isSalesOrAdmin } from "../middlewares/rbac.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Retorna una lista con todos los usuarios registrados en el sistema.
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "3110"
 *                   name:
 *                     type: string
 *                     example: "Orlando"
 *                   email:
 *                     type: string
 *                     example: "orlando@gmail.com"
 */
router.get("/", verifyToken, isSalesOrAdmin, UserController.getAllUsers);

router.get("/recent", verifyToken, isSalesOrAdmin, UserController.getRecentUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     description: Retorna los datos de un usuario específico.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a buscar
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos con éxito
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", verifyToken, UserController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     description: Modifica los datos de un usuario en la base de datos.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Example Name"
 *               phone:
 *                 type: string
 *                 example: "3009998888"
 *               gender:
 *                 type: string
 *                 example: "male"
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
  "/:id",

  verifyToken,

  [
    body("name").optional().isString().withMessage("El nombre es requerido."),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("El teléfono debe ser válido."),
    body("gender").optional().isString().withMessage("El género es requerido."),
  ],

  UserController.updateUser
);

export default router;
