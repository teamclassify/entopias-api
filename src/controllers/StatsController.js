import ResponseDataBuilder from "../models/ResponseData.js";
import StatsService from "../services/StatsService.js";
import validateBody from "../validators/validator.js"; // Using for query validation, or replace with a proper validateQuery

class StatsController {
    constructor() {
        this.statsService = new StatsService();
    }

    getTopSalesVarieties = async (req, res, next) => {
        // Validate query parameters
        if (validateBody(req.query)) return;
        const { startDate, endDate, limit, order } = req.query;
        const options = {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
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
        if (validateBody(req.query)) return;
        const { startDate, endDate, limit, order } = req.query;
        const options = {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
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
    };

    getTopProfitableVarieties = async (req, res, next) => {
        if (validateBody(req.query)) return;
        const { startDate, endDate, limit, order } = req.query;
        const options = {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
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
    };
}

export default StatsController;