import express from "express";
import { body } from "express-validator";
import ProducerController from "../controllers/ProducerController.js";
import { isAdmin } from "../middlewares/rbac.js";
import verifyToken from "../middlewares/verifyToken.js";

const producerRouter = express.Router();
const producerController = new ProducerController();

/**
 * @swagger
 * /producers:
 *   get:
 *     summary: Obtiene todos los productores
 *     tags: [Producers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productores obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       country:
 *                         type: string
 *                       state:
 *                         type: string
 *                       farm:
 *                         type: string
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Productores obtenidos exitosamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-20T15:30:00.000Z"
 */
producerRouter.get(
  "/",
  verifyToken,
  isAdmin,
  producerController.getAllProducers
);

/**
 * @swagger
 * /producers/{id}:
 *   get:
 *     summary: Obtiene un productor por ID
 *     tags: [Producers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del productor
 *     responses:
 *       200:
 *         description: Productor encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     country:
 *                       type: string
 *                     state:
 *                       type: string
 *                     farm:
 *                       type: string
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Productor encontrado exitosamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-20T15:30:00.000Z"
 */
producerRouter.get(
  "/:id",
  verifyToken,
  isAdmin,
  producerController.getProducerById
);

/**
 * @swagger
 * /producers:
 *   post:
 *     summary: Crea un nuevo productor
 *     tags: [Producers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - country
 *               - state
 *               - farm
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               farm:
 *                 type: string
 *     responses:
 *       201:
 *         description: Productor creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     country:
 *                       type: string
 *                     state:
 *                       type: string
 *                     farm:
 *                       type: string
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 201
 *                 msg:
 *                   type: string
 *                   example: "Productor creado exitosamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-20T15:30:00.000Z"
 */
producerRouter.post(
  "/",
  verifyToken,
  isAdmin,
  [
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("email")
      .notEmpty()
      .withMessage("El correo no puede ser campo vacio")
      .isEmail()
      .withMessage("El correo debe ser proporcionado"),
    body("phone").notEmpty().withMessage("El telefono es requerido"),
    body("country").notEmpty().withMessage("El Pais es requerido"),
    body("state").notEmpty().withMessage("El estado es requerido"),
    body("farm").notEmpty().withMessage("La finca es requerida"),
  ],
  producerController.createProducer
);

/**
 * @swagger
 * /producers/{id}:
 *   put:
 *     summary: Actualiza un productor existente
 *     tags: [Producers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del productor a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               farm:
 *                 type: string
 *     responses:
 *       200:
 *         description: Productor actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     country:
 *                       type: string
 *                     state:
 *                       type: string
 *                     farm:
 *                       type: string
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Productor actualizado exitosamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-20T15:30:00.000Z"
 */
producerRouter.put(
  "/:id",
  verifyToken,
  isAdmin,
  [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Name, if provided, cannot be empty."),
    body("email")
      .optional()
      .isEmail()
      .withMessage("If provided, email must be valid."),
    body("phone")
      .optional()
      .notEmpty()
      .withMessage("Phone, if provided, cannot be empty."),
    body("country")
      .optional()
      .notEmpty()
      .withMessage("Country, if provided, cannot be empty."),
    body("state")
      .optional()
      .notEmpty()
      .withMessage("State, if provided, cannot be empty."),
    body("farm")
      .optional()
      .notEmpty()
      .withMessage("Farm, if provided, cannot be empty."),
  ],
  producerController.updateProducer
);

/**
 * @swagger
 * /producers/{id}:
 *   delete:
 *     summary: Elimina un productor
 *     tags: [Producers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del productor a eliminar
 *     responses:
 *       200:
 *         description: Productor eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: null
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: "Productor eliminado exitosamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-20T15:30:00.000Z"
 */
producerRouter.delete(
  "/:id",
  verifyToken,
  isAdmin,
  producerController.deleteProducer
);

export default producerRouter;
