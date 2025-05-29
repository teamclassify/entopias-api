import * as fs from "fs/promises";
import mustache from "mustache";
import * as path from "path";
// import * as puppeteer from "puppeteer";
import pdf from "html-pdf-node";
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

        // Formatear fechas a dd/mm/aaaa
        function formatearFechaIso(fecha) {
            if (!fecha) return null;
            let fechaStr;
            if (typeof fecha === "string") {
                fechaStr = fecha;
            } else if (fecha instanceof Date) {
                fechaStr = fecha.toISOString();
            } else {
                return null;
            }

            const [año, mes, dia] = fechaStr.split("T")[0].split("-");
            return `${dia}/${mes}/${año}`;
        }

        const fecha1 = from ? formatearFechaIso(from) : null;
        const fecha2 = to ? formatearFechaIso(to) : null;

        if (parsedTo) {
            parsedTo.setUTCHours(23, 59, 59, 999);
        }

        // Configuración para rutas
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Ruta de la imagen
        const logoPath = path.resolve(__dirname, '../../public/logo.webp');
        const logoBase64 = await fs.readFile(logoPath, { encoding: 'base64' });
        const logoDataUrl = `data:image/png;base64,${logoBase64}`;


        try {
            // Llamar las facturas
            const invoices = await this.invoicesService.findByDateRange({
                from: parsedFrom,
                to: parsedTo,
                limit: parseInt(limit),
            });

            console.log("Invoices: --->", invoices);

            // Procesar totales
            const cantidadPedidos = invoices.length;
            const productosVendidos = invoices.reduce((acc, f) => {
                return acc + f.order.items.reduce((suma, i) => suma + i.quantity, 0);
            }, 0);
            const ingresosGenerados = invoices.reduce((total, invoice) => total + invoice.amount, 0);

            // Formatear las fehcas de facturas
            const invoicesFormateadas = invoices.map(invoice => ({
                ...invoice,
                date: formatearFechaIso(invoice.date),
            }));

            
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
            const html = mustache.render(template,
                {
                    invoices: invoicesFormateadas,
                    cantidadPedidos,
                    productosVendidos,
                    ingresosGenerados,
                    fecha1,
                    fecha2,
                    logo: logoDataUrl
                });

            // Generar el pdf con puppeteer
            // const browser = await puppeteer.launch();
            // const page = await browser.newPage();
            // await page.setContent(html, { waitUntil: "load" });
            // const pdfBuffer = await page.pdf({ format: "A4" });
            // await browser.close();
            // const result = Buffer.from(pdfBuffer);

            // generar pdf pero con otra librería pdfkit
            const options = { format: "A4" };
            const file = { content: html };

            const pdfBuffer = await pdf.generatePdf(file, options);
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
