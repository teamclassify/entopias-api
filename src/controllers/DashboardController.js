import ResponseDataBuilder from "../models/ResponseData.js";
import DashboardService from "../services/DashBoardService.js";

class DashboardController {
  constructor() {
    this.dashboardService = new DashboardService();
  }

  getAdminSummary = async (req, res, next) => {
    try {
      const summary = await this.dashboardService.getAdminSummary();

      const response = new ResponseDataBuilder()
        .setData(summary)
        .setStatus(200)
        .setMsg("Dashboard summary fetched successfully")
        .build();

      return res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default DashboardController;
