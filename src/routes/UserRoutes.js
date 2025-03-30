import express from "express";
import UserController from "../controllers/UserController.js";
import { isAdmin } from "../middlewares/rbac.js";
import verifyToken from "../middlewares/verifyToken.js";
import { body } from "express-validator";

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
router.get("/", verifyToken, isAdmin, UserController.getAllUsers);

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
 *                 example: "Orlando Actualizado"
 *               photo:
 *                 type: string
 *                 example: "nueva_foto.jpg"
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: "male"
 *               phone:
 *                 type: string
 *                 example: "3009998888"
 *               email:
 *                 type: string
 *                 example: "orlandoNuevo@gmail.com"
 *               role:
 *                 type: string
 *                 example: "admin"
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
    body("name").notEmpty().withMessage("El nombre es requerido."),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("El teléfono debe ser válido."),
  ],

  UserController.updateUser
);

export default router;
