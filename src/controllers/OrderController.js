import ResponseDataBuilder from "../models/ResponseData.js";
import OrderService from "../services/OrderService.js";

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  getOrders = async (req, res, next) => {
    const { page } = req.query;
    const { where } = req.body;

    try {
      const orders = await this.orderService.find({ page, where });
      const count = await this.orderService.countAll({ where });

      const response = new ResponseDataBuilder()
        .setData({ orders, count })
        .setStatus(200)
        .setMsg("Orders fetched successfully")
        .build();

      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export default OrderController;
