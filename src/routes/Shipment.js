import express from "express";
import ShipmentController from "../controllers/ShipmentController.js";

const router = express.Router();
const controller = new ShipmentController();

router.get("/", controller.add);
router.get("/cities", controller.getCities);

export default router;
