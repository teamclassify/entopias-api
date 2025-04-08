import ProductorService from "../services/ProducerService.js";
import ResponseDataBuilder from "../models/ResponseData.js";
import validateBody from "../validators/validator.js";

class ProducerController {
  static async getAllProducers(req, res, next) {
    try {
      const { page } = req.query;
      const pageNumber = Number(page) || 1;
      const producers = await new ProducerService().find({
        page: pageNumber,
      });
      const count = await new ProducerService().countAll();

      const data = new ResponseDataBuilder()
        .setData({ producers, count })
        .setStatus(200)
        .setMsg("Producers retrieved successfully")
        .build();

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getProducerById(req, res, next) {
    try {
      const producer = await new ProducerService().findOne(req.params.id);
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
  }

  static async createProducer(req, res, next) {
    if (validateBody(req, res)) return;
    try {
      const producer = await new ProducerService().create(req.body);
      const data = new ResponseDataBuilder()
        .setData(producer)
        .setStatus(201)
        .setMsg("Producer created successfully")
        .build();

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async updateProducer(req, res, next) {
    if (validateBody(req, res)) return;
    try {
      const producer = await new ProducerService().update(
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
  }

  static async deleteProducer(req, res, next) {
    try {
      await new ProducerService().delete(req.params.id);
      const data = new ResponseDataBuilder()
        .setData(null)
        .setStatus(200)
        .setMsg("Producer deleted successfully")
        .build();

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default ProducerController;
