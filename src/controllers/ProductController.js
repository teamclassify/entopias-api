import ResponseDataBuilder from "../models/ResponseData.js";
import ProductService from "../services/ProductService.js";
import validateBody from "../validators/validator.js";

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  getAll = async (req, res, next) => {
    const { page } = req.query;
    const pageNumber = parseInt(page) || 1;

    try {
      const products = await this.productService.findAll({
        page: pageNumber,
      });
      const count = await this.productService.countAll();

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
      const product = await this.productService.create(req.body);
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
      const updatedProduct = await this.productService.update(id, req.body);
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
