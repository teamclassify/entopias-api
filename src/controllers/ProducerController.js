import ResponseDataBuilder from "../models/ResponseData.js";
import ProducerService from "../services/ProducerService.js";
import validateBody from "../validators/validator.js";

class ProducerController {
  constructor() {
    this.producerService = new ProducerService();
  }

  getAllProducers = async (req, res, next) => {
    try {
      const { page } = req.query;
      const pageNumber = Number(page) || 1;

      const producers = await this.producerService.find({
        page: pageNumber,
      });

      const count = await this.producerService.countAll();

      const data = new ResponseDataBuilder()
        .setData({ producers, count })
        .setStatus(200)
        .setMsg("Producers retrieved successfully")
        .build();

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  getProducerById = async (req, res, next) => {
    try {
      const producer = await this.producerService.findOne(req.params.id);
      if (!producer) {
        const data = new ResponseDataBuilder()
          .setData(null)
          .setStatus(404)
          .setMsg("Producer not found")
          .build();
        return res.status(404).json(data);
      }

      const data = new ResponseDataBuilder()
        .setData(producer)
        .setStatus(200)
        .setMsg("Producer found")
        .build();

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  createProducer = async (req, res, next) => {
    if (validateBody(req, res)) return;

    try {
      const producer = await this.producerService.create(req.body);
      const data = new ResponseDataBuilder()
        .setData(producer)
        .setStatus(201)
        .setMsg("Producer created successfully")
        .build();

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };

  updateProducer = async (req, res, next) => {
    if (validateBody(req, res)) return;
    try {
      const producer = await this.producerService.update(
        req.params.id,
        req.body
      );
      const data = new ResponseDataBuilder()
        .setData(producer)
        .setStatus(200)
        .setMsg("Producer updated successfully")
        .build();

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  deleteProducer = async (req, res, next) => {
    try {
      await this.producerService.delete(req.params.id);
      const data = new ResponseDataBuilder()
        .setData(null)
        .setStatus(200)
        .setMsg("Producer deleted successfully")
        .build();

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}

export default ProducerController;
