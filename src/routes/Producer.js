import express from "express";
import { body, validationResult } from "express-validator";
import ProducerController from "../controllers/ProducerController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/rbac.js";

const producerRouter = express.Router();

// Todas las rutas requieren que el usuario sea ADMIN

producerRouter.get(
  "/",
  verifyToken,
  isAdmin,
  ProducerController.getAllProducers
);

producerRouter.get(
  "/:id",
  verifyToken,
  isAdmin,
  ProducerController.getProducerById
);

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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  ProducerController.createProducer
);

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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  ProducerController.updateProducer
);

producerRouter.delete(
  "/:id",
  verifyToken,
  isAdmin,
  ProducerController.deleteProducer
);

export default producerRouter;
