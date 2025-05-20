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

    getMostProfitableVarieties = async (req, res, next) => {
        if (validateBody(req.body)) return;
        if (validateBody(req.body)) return;
        const { startDate, endDate, limit, order } = req.body;
        const options = {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            ...(limit !== undefined && { limit: parseInt(limit, 10) }),
        };
        try {
            const top = await this.statsService.mostProfitableVarieties(options);
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
}

export default StatsController;