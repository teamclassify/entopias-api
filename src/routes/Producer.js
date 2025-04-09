import express from "express";
import { body } from "express-validator";
import ProducerController from "../controllers/ProducerController.js";
import { isAdmin } from "../middlewares/rbac.js";
import verifyToken from "../middlewares/verifyToken.js";

const producerRouter = express.Router();
const producerController = new ProducerController();

producerRouter.get(
  "/",

  verifyToken,
  isAdmin,

  producerController.getAllProducers
);

producerRouter.get(
  "/:id",

  verifyToken,
  isAdmin,

  producerController.getProducerById
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

  producerController.createProducer
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

  producerController.updateProducer
);

producerRouter.delete(
  "/:id",

  verifyToken,
  isAdmin,

  producerController.deleteProducer
);

export default producerRouter;
