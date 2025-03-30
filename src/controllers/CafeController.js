import ResponseDataBuilder from "../models/ResponseData.js";
import CafeService from "../services/CafeService.js";
import validateBody from "../validators/validator.js";

class CafeController {
  constructor() {
    this.cafeService = new CafeService();
  }

  getAll = async (req, res, next) => {
    try {
      const cafes = await this.cafeService.findAll();
      const data = new ResponseDataBuilder()
        .setData(cafes)
        .setStatus(200)
        .setMsg("Cafes retrieved successfully")
        .build();
      res.json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getOne = async (req, res, next) => {
    const { id } = req.params;
    try {
      const cafe = await this.cafeService.findOne(id);
      const data = cafe
        ? new ResponseDataBuilder()
            .setData(cafe)
            .setStatus(200)
            .setMsg("Cafe found")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Cafe not found")
            .build();
      res.json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  create = async (req, res, next) => {
    if (validateBody(req, res)) {
      return;
    }
    try {
      const cafe = await this.cafeService.create(req.body);
      const data = new ResponseDataBuilder()
        .setData(cafe)
        .setStatus(201)
        .setMsg("Cafe created successfully")
        .build();
      res.status(201).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  update = async (req, res, next) => {
    const { id } = req.params;
    if (validateBody(req, res)) {
      return;
    }
    try {
      const updatedCafe = await this.cafeService.update(id, req.body);
      const data = updatedCafe
        ? new ResponseDataBuilder()
            .setData(updatedCafe)
            .setStatus(200)
            .setMsg("Cafe updated successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Cafe not found")
            .build();
      res.json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    const { id } = req.params;
    try {
      const deleted = await this.cafeService.delete(id);
      const data = deleted
        ? new ResponseDataBuilder()
            .setData(null)
            .setStatus(200)
            .setMsg("Cafe deleted successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Cafe not found")
            .build();
      res.json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

export default CafeController;
