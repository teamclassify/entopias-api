import ResponseDataBuilder from "../models/ResponseData.js";
import StatsService from "../services/StatsService.js";
import validateBody from "../validators/validator.js";

class StatsController {
    constructor() {
        this.statsService = new StatsService();
    }

    getTopSalesVarieties = async (req, res, next) => {
        if (validateBody(req.body)) return;
        const { startDate, endDate, limit, order } = req.body;
        const options = {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            ...(limit !== undefined && { limit: parseInt(limit, 10) }),
            ...(order !== undefined && { order }),
        };
        try {
            const topSales = await this.statsService.getSalesVarieties(options);
            const data = new ResponseDataBuilder()
                .setData(topSales)
                .setStatus(200)
                .setMsg("Sales retrieved successfully")
                .build();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            next(err);
        }
    };

    getTopSalesProduct = async (req, res, next) => {
        if (validateBody(req.body)) return;
        const { startDate, endDate, limit, order } = req.body;
        const options = {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            ...(limit !== undefined && { limit: parseInt(limit, 10) }),
            ...(order !== undefined && { order }),
        };
        try {
            const topSales = await this.statsService.getSalesProducts(options);
            const data = new ResponseDataBuilder()
                .setData(topSales)
                .setStatus(200)
                .setMsg("Sales retrieved successfully")
                .build();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    getTopProfitableVarieties = async (req, res, next) => {
        if (validateBody(req.body)) return;
        const { startDate, endDate, limit, order } = req.body;
        const options = {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            ...(limit !== undefined && { limit: parseInt(limit, 10) }),
            ...(order !== undefined && { order }),
        };
        try {
            const top = await this.statsService.topProfitableVarieties(options);
            const data = new ResponseDataBuilder()
                .setData(top)
                .setStatus(200)
                .setMsg("Varieties retrieved successfully")
                .build();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    getTotalOrders = async (req, res, next) => {
        try {
            const totalOrders = await this.statsService.getTotalOrders();
            const data = new ResponseDataBuilder()
                .setData({ totalOrders })
                .setStatus(200)
                .setMsg("Total orders retrieved successfully")
                .build();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            next(err);
        }
    };

    getOrdersByDate = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const options = {
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            };
            const orders = await this.statsService.getOrdersByDate(options);
            const data = new ResponseDataBuilder()
                .setData({ orders })
                .setStatus(200)
                .setMsg("Orders by date retrieved successfully")
                .build();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            next(err);
        }
    };

    getTotalRevenueByDate = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const options = {
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            };
            const revenue = await this.statsService.getTotalRevenueByDate(options);
            const data = new ResponseDataBuilder()
                .setData({ revenue })
                .setStatus(200)
                .setMsg("Revenue retrieved successfully")
                .build();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            next(err);
        }
    };

    getGroupOrdersByStatus = async (req, res, next) => {
        try {
            const grouped = await this.statsService.getGroupOrdersByStatus();
            const data = new ResponseDataBuilder()
                .setData(grouped)
                .setStatus(200)
                .setMsg("Order statuses retrieved successfully")
                .build();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            next(err);
        }
    };

    getGroupInvoiceByBank = async (req, res, next) => {
        try {
            const grouped = await this.statsService.getGroupInvoiceByBank();
            const data = new ResponseDataBuilder()
                .setData(grouped)
                .setStatus(200)
                .setMsg("Invoice data grouped by bank retrieved successfully")
                .build();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            next(err);
        }
    };

    getAverageOrderValue = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const options = {
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            };
            const averageOrderValue = await this.statsService.getAverageOrderValue(options);
            const data = new ResponseDataBuilder()
                .setData({ averageOrderValue })
                .setStatus(200)
                .setMsg("Average order value retrieved successfully")
                .build();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            next(err);
        }
    };

    getAverageProductsPerOrder = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const options = {
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            };
            const averageProductsPerOrder = await this.statsService.getAverageProductsPerOrder(options);
            const data = new ResponseDataBuilder()
                .setData({ averageProductsPerOrder })
                .setStatus(200)
                .setMsg("Average products per order retrieved successfully")
                .build();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            next(err);
        }
    };

}

export default StatsController;