import ResponseDataBuilder from "../models/ResponseData.js";
import InvoicesService from "../services/InvoicesService.js";

class InvoicesController {
  constructor() {
    this.invoicesService = new InvoicesService();
  }

  getInvoices = async (req, res, next) => {
    const { page } = req.query;
    const { where } = req.body;

    try {
      const invoices = await this.invoicesService.find({
        page,
        where,
      });
      const count = await this.invoicesService.countAll({ where });

      const response = new ResponseDataBuilder()
        .setData({ invoices, count })
        .setStatus(200)
        .setMsg("Invoices fetched successfully")
        .build();

      return res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default InvoicesController;
