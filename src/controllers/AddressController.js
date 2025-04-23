import ResponseDataBuilder from "../models/ResponseData.js";
import AddressService from "../services/AddressService.js";
import validateBody from "../validators/validator.js";

class AddressController {
  constructor() {
    this.addressService = new AddressService();
  }

  getAll = async (req, res, next) => {
    if (validateBody(req, res)) {
      return;
    }

    try {
      const userId = req.id;

      const addresses = await this.addressService.findAllByUser(userId);
      const data = new ResponseDataBuilder()
        .setData(addresses)
        .setStatus(200)
        .setMsg("Addresses retrieved successfully")
        .build();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getOne = async (req, res, next) => {
    try {
      const userId = req.id;
      const { id } = req.params;
      const address = await this.addressService.findOne(id, userId);
      if (!address) {
        const data = new ResponseDataBuilder()
          .setData(null)
          .setStatus(404)
          .setMsg("Address not found")
          .build();
        return res.status(404).json(data);
      }
      const data = new ResponseDataBuilder()
        .setData(address)
        .setStatus(200)
        .setMsg("Address found")
        .build();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  create = async (req, res, next) => {
    if (validateBody(req, res)) return;

    try {
      const userId = req.id;

      const address = await this.addressService.create(userId, {
        city: req.body.city,
        country: req.body.country,
        postalCode: req.body.postalCode,
        address: req.body.address,
      });

      const data = new ResponseDataBuilder()
        .setData(address)
        .setStatus(201)
        .setMsg("Address created successfully")
        .build();

      res.status(data.status).json(data);
    } catch (err) {
      console.error(err);
      next(err.message);
    }
  };

  update = async (req, res, next) => {
    if (validateBody(req, res)) return;

    try {
      const userId = req.id;
      const { id } = req.params;

      const result = await this.addressService.update(id, userId, {
        city: req.body.city,
        country: req.body.country,
        postalCode: req.body.postalCode,
        address: req.body.address,
      });

      if (result.count === 0) {
        const data = new ResponseDataBuilder()
          .setData(null)
          .setStatus(404)
          .setMsg("Address not found or not owner")
          .build();

        return res.status(data.status).json(data);
      }

      const updated = await this.addressService.findOne(id, userId);

      const data = new ResponseDataBuilder()
        .setData(updated)
        .setStatus(200)
        .setMsg("Address updated successfully")
        .build();

      res.status(data.status).json(data);
    } catch (err) {
      next(err.message);
    }
  };

  delete = async (req, res, next) => {
    try {
      const userId = req.id;
      const { id } = req.params;

      const result = await this.addressService.delete(id, userId);

      if (result.count === 0) {
        const data = new ResponseDataBuilder()
          .setData(null)
          .setStatus(404)
          .setMsg("Address not found or not owner")
          .build();

        return res.status(data.status).json(data);
      }

      const data = new ResponseDataBuilder()
        .setData(null)
        .setStatus(200)
        .setMsg("Address deleted successfully")
        .build();

      res.status(data.status).json(data);
    } catch (err) {
      next(err.message);
    }
  };
}

export default AddressController;
