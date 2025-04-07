import ResponseDataBuilder from "../models/ResponseData";
import ProductPhotoService from "../services/ProductPhotoService";
import validateBody from "../validators/validator";

class ProductPhotoController {
  constructor() {
    this.ProductPhotoService = new ProductPhotoService();
  }

  getAll = async (req, res, next) => {
    try {
      const photos = await this.productPhotoService.findAll();
      const data = new ResponseDataBuilder()
        .setData(photos)
        .setStatus(200)
        .setMsg("Product photos retrieved successfully")
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
      const photo = await this.productPhotoService.findOne(id);
      const data = photo
        ? new ResponseDataBuilder()
            .setData(photo)
            .setStatus(200)
            .setMsg("Product photo found")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Product photo not found")
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
      const photo = await this.productPhotoService.create(req.body);
      const data = new ResponseDataBuilder()
        .setData(photo)
        .setStatus(201)
        .setMsg("Product photo created successfully")
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
      const updatedPhoto = await this.productPhotoService.update(id, req.body);
      const data = updatedPhoto
        ? new ResponseDataBuilder()
            .setData(updatedPhoto)
            .setStatus(200)
            .setMsg("Product photo updated successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Product photo not found")
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
      const deletedPhoto = await this.productPhotoService.delete(id);
      const data = deletedPhoto
        ? new ResponseDataBuilder()
            .setData(null)
            .setStatus(200)
            .setMsg("Product photo deleted successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Product photo not found")
            .build();
      res.status(data.status).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

export default ProductPhotoController;
