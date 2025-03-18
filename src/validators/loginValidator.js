import { body } from "express-validator";

export const loginValidator = [
  body("email", "No puede estar vacio el email").not().isEmpty(),
  body("email", "Email invalido").isEmail(),
];
