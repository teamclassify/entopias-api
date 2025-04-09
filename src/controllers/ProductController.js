import ResponseDataBuilder from "../models/ResponseData.js";
import ProductService from "../services/ProductService.js";
import validateBody from "../validators/validator.js";

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  getAll = async (req, res, next) => {
    const { page, search } = req.query;
    const pageNumber = parseInt(page) || 1;

    const where = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    try {
      const products = await this.productService.findAll({
        page: pageNumber,
        where,
      });
      const count = await this.productService.countAll({
        where,
      });

      const data = new ResponseDataBuilder()
        .setData({
          products,
          count,
        })
        .setStatus(200)
        .setMsg("Products retrieved successfully")
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
      const product = await this.productService.findOne(id);
      const data = product
        ? new ResponseDataBuilder()
            .setData(product)
            .setStatus(200)
            .setMsg("Product found")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Product not found")
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
      const photos = await this.productService.uploadPhotos(req.files);

      const product = await this.productService.create({
        ...req.body,
        photos: photos.map((photo) => {
          return {
            url: `${process.env.SUPABASE_URL}/storage/v1/object/public/${photo.fullPath}`,
          };
        }),
      });

      const data = new ResponseDataBuilder()
        .setData(product)
        .setStatus(201)
        .setMsg("Product created successfully")
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
      const photosFiles = await this.productService.uploadPhotos(req.files);
      const { photos } = req.body;
      const photosArray = Array.isArray(photos) ? photos : [photos];

      const photosToAdd = photosFiles
        .map((photo) => {
          return {
            url: `${process.env.SUPABASE_URL}/storage/v1/object/public/${photo.fullPath}`,
          };
        })
        .concat(
          photosArray
            .filter((photo) => photo !== undefined)
            .map((photo) => {
              return {
                url: photo,
              };
            })
        );

      console.log(req.body);

      const updatedProduct = await this.productService.update(id, {
        ...req.body,
        photos: photosToAdd,
      });

      const data = updatedProduct
        ? new ResponseDataBuilder()
            .setData(updatedProduct)
            .setStatus(200)
            .setMsg("Product updated successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Product not found")
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
      const deleted = await this.productService.delete(id);

      const data = deleted
        ? new ResponseDataBuilder()
            .setData(null)
            .setStatus(200)
            .setMsg("Product deleted successfully")
            .build()
        : new ResponseDataBuilder()
            .setData(null)
            .setStatus(404)
            .setMsg("Product not found")
            .build();
      res.json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

export default ProductController;
