import * as fs from "fs/promises";
import mustache from "mustache";
import * as path from "path";
import * as puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import InvoicesService from "../services/InvoicesService.js";

class ReportController {
  constructor() {
    this.invoicesService = new InvoicesService();
  }

  generatePdf = async (req, res, next) => {
    const { from, to, limit = 100 } = req.query;

    // Validar fechas
    const parsedFrom =
      from && !isNaN(new Date(from)) ? new Date(from) : undefined;
    const parsedTo = to && !isNaN(new Date(to)) ? new Date(to) : undefined;

    if (parsedTo) {
      parsedTo.setUTCHours(23, 59, 59, 999);
    }

    try {
      // Llamar las facturas
      const invoices = await this.invoicesService.findByDateRange({
        from: parsedFrom,
        to: parsedTo,
        limit: parseInt(limit),
      });

      console.log("Invoices: --->", invoices);

      // Procesar totales
      const totalVentas = invoices.reduce((acc, f) => acc + f.amount, 0);
      const cantidadPedidos = invoices.length;
      const productosVendidos = invoices.reduce((acc, f) => {
        return acc + f.order.items.reduce((suma, i) => suma + i.quantity, 0);
      }, 0);
      const ingresosGenerados = invoices.reduce(
        (total, invoice) => total + invoice.amount,
        0
      );

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      // Cargar la plantilla
      const templatePath = path.join(
        __dirname,
        "..",
        "pdf",
        "invoiceReport.html"
      );
      console.log(templatePath);
      const template = await fs.readFile(templatePath, "utf8");

      // Renderizar el html
      const html = mustache.render(template, {
        invoices,
        totalVentas,
        cantidadPedidos,
        productosVendidos,
        ingresosGenerados,
      });

      // Generar el pdf con puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      const result = Buffer.from(pdfBuffer);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="reporte-facturas.pdf"'
      );
      res.send(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

export default ReportController;
