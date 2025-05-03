import ResponseDataBuilder from "../models/ResponseData.js";
import OrderService from "../services/OrderService.js";

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  getOrders = async (req, res, next) => {
    const { page } = req.query;
    const { status, userId } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

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
      console.log(error);
      next(error);
    }
  };

  getOrderById = async (req, res, next) => {
    const { id } = req.params;
    const idNumber = parseInt(id, 10);

    try {
      const order = await this.orderService.findOne({ id: idNumber });

      if (!order) {
        const response = new ResponseDataBuilder()
          .setStatus(404)
          .setError(true)
          .setMsg("Order not found")
          .build();

        return res.status(response.status).json(response);
      }

      const response = new ResponseDataBuilder()
        .setData(order)
        .setStatus(200)
        .setMsg("Order fetched successfully")
        .build();

      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export default OrderController;
