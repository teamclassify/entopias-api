import ResponseDataBuilder from "../models/ResponseData.js";
import VarietyService from "../services/VarietyService.js";
import validateBody from "../validators/validator.js";

class VarietyController {
  constructor() {
    this.varietyService = new VarietyService();
  }

  getAll = async (req, res, next) => {
    try {
      const varieties = await this.varietyService.findAll();
      const data = new ResponseDataBuilder()
        .setData(varieties)
        .setStatus(200)
        .setMsg("Varieties retrieved successfully")
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
      const variety = await this.varietyService.findOne(id);
      const data = variety
        ? new ResponseDataBuilder()
            .setData(variety)
            .setStatus(200)
            .setMsg("Variety found")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Variety not found")
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
      const variety = await this.varietyService.create(req.body);
      const data = new ResponseDataBuilder()
        .setData(variety)
        .setStatus(201)
        .setMsg("Variety created successfully")
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
      const updatedVariety = await this.varietyService.update(id, req.body);
      const data = updatedVariety
        ? new ResponseDataBuilder()
            .setData(updatedVariety)
            .setStatus(200)
            .setMsg("Variety updated successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Variety not found")
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
      const deletedVariety = await this.varietyService.delete(id);
      const data = deletedVariety
        ? new ResponseDataBuilder()
            .setData(null)
            .setStatus(200)
            .setMsg("Variety deleted successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Variety not found")
            .build();
      res.status(data.status).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

export default VarietyController;