import ResponseDataBuilder from "../models/ResponseData.js";
import CustomerStatsService from "../services/CustomerStatsService.js";
import validateBody from "../validators/validator.js";

class CustomerStatsController {
  constructor() {
    this.statsService = new CustomerStatsService();
  }

  getTotalCustomers = async (req, res, next) => {
    try {
      const total = await this.statsService.getTotalCustomers();
      const data = new ResponseDataBuilder()
        .setData({ total })
        .setStatus(200)
        .setMsg("Total customers retrieved successfully")
        .build();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getCustomersRegisteredMonthly = async (req, res, next) => {
    if (validateBody(req.query)) return;
    try {
      const months = parseInt(req.query.months) || 12;
      const result = await this.statsService.getCustomersRegisteredMonthly({ months });
      const data = new ResponseDataBuilder()
        .setData(result)
        .setStatus(200)
        .setMsg("Customer registrations by month retrieved successfully")
        .build();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getCustomersWithOrders = async (req, res, next) => {
    try {
      const count = await this.statsService.getCustomersWithOrders();
      const data = new ResponseDataBuilder()
        .setData({ count })
        .setStatus(200)
        .setMsg("Customers with orders retrieved successfully")
        .build();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getTopSpenders = async (req, res, next) => {
    if (validateBody(req.query)) return;
    try {
      const limit = parseInt(req.query.limit) || 5;
      const result = await this.statsService.getTopSpenders({ limit });
      const data = new ResponseDataBuilder()
        .setData(result)
        .setStatus(200)
        .setMsg("Top spenders retrieved successfully")
        .build();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getCustomersByCity = async (req, res, next) => {
    try {
      const result = await this.statsService.getCustomersByCity();
      const data = new ResponseDataBuilder()
        .setData(result)
        .setStatus(200)
        .setMsg("Customers grouped by city retrieved successfully")
        .build();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getCustomersByCountry = async (req, res, next) => {
    try {
      const result = await this.statsService.getCustomersByCountry();
      const data = new ResponseDataBuilder()
        .setData(result)
        .setStatus(200)
        .setMsg("Customers grouped by country retrieved successfully")
        .build();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getCustomersWithPendingInvoices = async (req, res, next) => {
    try {
      const result = await this.statsService.getCustomersWithPendingInvoices();
      const data = new ResponseDataBuilder()
        .setData(result)
        .setStatus(200)
        .setMsg("Customers with pending invoices retrieved successfully")
        .build();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getPendingInvoicesSummary = async (req, res, next) => {
    try {
      const result = await this.statsService.getPendingInvoicesSummary();
      const data = new ResponseDataBuilder()
        .setData(result)
        .setStatus(200)
        .setMsg("Pending invoice summary retrieved successfully")
        .build();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

export default CustomerStatsController;
