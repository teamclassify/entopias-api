import ProductorService from "../services/ProductorService.js";
import ResponseDataBuilder from "../models/ResponseData.js";
import validateBody from "../validators/validator.js";

class ProductorController {
  static async getAllProductores(req, res, next) {
    try {
      const { page } = req.query;
      const productores = await new ProductorService().find({
        page: Number(page) || 1,
      });
      const count = await new ProductorService().countAll();

      const data = new ResponseDataBuilder()
        .setData({ productores, count })
        .setStatus(200)
        .setMsg("Productores encontrados")
        .build();

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getProductorById(req, res, next) {
    try {
      const productor = await new ProductorService().findOne(req.params.id);
      if (!productor) {
        const data = new ResponseDataBuilder()
          .setData(null)
          .setStatus(404)
          .setMsg("Productor no encontrado")
          .build();
        return res.status(404).json(data);
      }

      const data = new ResponseDataBuilder()
        .setData(productor)
        .setStatus(200)
        .setMsg("Productor encontrado")
        .build();

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async createProductor(req, res, next) {
    // Validar el body
    if (validateBody(req, res)) return;

    try {
      const productor = await new ProductorService().create(req.body);

      const data = new ResponseDataBuilder()
        .setData(productor)
        .setStatus(201)
        .setMsg("Productor creado exitosamente")
        .build();

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async updateProductor(req, res, next) {
    if (validateBody(req, res)) return;

    try {
      const productor = await new ProductorService().update(
        req.params.id,
        req.body
      );

      const data = new ResponseDataBuilder()
        .setData(productor)
        .setStatus(200)
        .setMsg("Productor actualizado exitosamente")
        .build();

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProductor(req, res, next) {
    try {
      await new ProductorService().delete(req.params.id);

      const data = new ResponseDataBuilder()
        .setData(null)
        .setStatus(200)
        .setMsg("Productor eliminado exitosamente")
        .build();

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default ProductorController;