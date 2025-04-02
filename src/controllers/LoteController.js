import ResponseDataBuilder from "../models/ResponseData.js";
import LoteService from "../services/LoteService.js";
import validateBody from "../validators/validator.js";

class LoteController {
  constructor() {
    this.loteService = new LoteService();
  }

  getAll = async (req, res, next) => {
    const { page = 1 } = req.query;
    const pageNumber = parseInt(page) || 1;

    try {
      const lotes = await this.loteService.findAll({
        page: pageNumber,
      });

      const data = new ResponseDataBuilder()
        .setData(lotes)
        .setStatus(200)
        .setMsg("Lotes retrieved successfully")
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
      const lote = await this.loteService.findOne(Number(id));
      const data = lote
        ? new ResponseDataBuilder()
            .setData(lote)
            .setStatus(200)
            .setMsg("Lote found")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Lote not found")
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
      const lote = await this.loteService.create(req.body);
      const data = new ResponseDataBuilder()
        .setData(lote)
        .setStatus(201)
        .setMsg("Lote created successfully")
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
      const updatedLote = await this.loteService.update(Number(id), req.body);
      const data = updatedLote
        ? new ResponseDataBuilder()
            .setData(updatedLote)
            .setStatus(200)
            .setMsg("Lote updated successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Lote not found")
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
      const deleted = await this.loteService.delete(Number(id));
      const data = deleted
        ? new ResponseDataBuilder()
            .setData(null)
            .setStatus(200)
            .setMsg("Lote deleted successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Lote not found")
            .build();
      res.json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

export default LoteController;
