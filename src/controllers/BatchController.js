import ResponseDataBuilder from "../models/ResponseData.js";
import BatchService from "../services/BatchService.js";
import validateBody from "../validators/validator.js";

class BatchController {
  constructor() {
    this.batchService = new BatchService();
  }

  getAll = async (req, res, next) => {
    const { page = 1 } = req.query;
    const pageNumber = parseInt(page) || 1;
    try {
      const batches = await this.batchService.findAll({ page: pageNumber });
      const data = new ResponseDataBuilder()
        .setData(batches)
        .setStatus(200)
        .setMsg("Batches retrieved successfully")
        .build();
      res.json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getOne = async (req, res, next) => {
    const { id } = req.params;
    console.log("Fetching batch with ID:", id);

    try {
      const batch = await this.batchService.findOne(Number(id));
      const data = batch
        ? new ResponseDataBuilder()
            .setData(batch)
            .setStatus(200)
            .setMsg("Batch found")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Batch not found")
            .build();
      res.json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  create = async (req, res, next) => {
    if (validateBody(req, res)) return;

    try {
      const batch = await this.batchService.create(req.body);

      const data = new ResponseDataBuilder()
        .setData(batch)
        .setStatus(201)
        .setMsg("Batch created successfully")
        .build();

      res.status(201).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  update = async (req, res, next) => {
    const { id } = req.params;
    if (validateBody(req, res)) return;
    try {
      const updatedBatch = await this.batchService.update(Number(id), req.body);
      const data = updatedBatch
        ? new ResponseDataBuilder()
            .setData(updatedBatch)
            .setStatus(200)
            .setMsg("Batch updated successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Batch not found")
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
      const deleted = await this.batchService.delete(Number(id));
      const data = deleted
        ? new ResponseDataBuilder()
            .setData(null)
            .setStatus(200)
            .setMsg("Batch deleted successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Batch not found")
            .build();
      res.json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

export default BatchController;
