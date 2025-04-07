import ResponseDataBuilder from "../models/ResponseData.js";
import VariedadService from "../services/VariedadService.js";
import validateBody from "../validators/validator.js";

class VariedadController {
  constructor() {
    this.VariedadService = new VariedadService();
  }

  getAll = async (req, res, next) => {
    try {
      const variedades = await this.variedadService.findAll();
      const data = new ResponseDataBuilder()
        .setData(variedades)
        .setStatus(200)
        .setMsg("Variedades retrieved successfully")
        .build();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getOne = async (req, res, next) => {
    const { id } = req.params;
    try {
      const variedad = await this.variedadService.findOne(id);
      const data = variedad
        ? new ResponseDataBuilder()
            .setData(variedad)
            .setStatus(200)
            .setMsg("Variedad found")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Variedad not found")
            .build();
      res.status(data.status).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  create = async (req, res, next) => {
    if (validateBody(req, res)) return;
    try {
      const variedad = await this.variedadService.create(req.body);
      const data = new ResponseDataBuilder()
        .setData(variedad)
        .setStatus(201)
        .setMsg("Variedad created successfully")
        .build();
      res.status(201).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  update = async (req, res, next) => {
    if (validateBody(req, res)) return;
    const { id } = req.params;
    try {
      const updatedVariedad = await this.variedadService.update(id, req.body);
      const data = updatedVariedad
        ? new ResponseDataBuilder()
            .setData(updatedVariedad)
            .setStatus(200)
            .setMsg("Variedad updated successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Variedad not found")
            .build();
      res.status(data.status).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    const { id } = req.params;
    try {
      const deletedVariedad = await this.variedadService.delete(id);
      const data = deletedVariedad
        ? new ResponseDataBuilder()
            .setData(null)
            .setStatus(200)
            .setMsg("Variedad deleted successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Variedad not found")
            .build();
      res.status(data.status).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

export default VariedadController;
