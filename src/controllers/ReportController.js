import * as fs from "fs/promises";
import mustache from "mustache";
import * as path from "path";
// import * as puppeteer from "puppeteer";
import pdf from "html-pdf-node";
import { fileURLToPath } from "url";
import InvoicesService from "../services/InvoicesService.js";
import ExcelJS from 'exceljs';

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


    generateCsv = async (req, res, next) => {
        const { from, to, limit = 100 } = req.query;

        const parsedFrom = from && !isNaN(new Date(from)) ? new Date(from) : undefined;
        const parsedTo = to && !isNaN(new Date(to)) ? new Date(to) : undefined;

        if (parsedTo) {
            parsedTo.setUTCHours(23, 59, 59, 999);
        }

        try {

            //filtrar las fechas por rango
            const invoices = await this.invoicesService.findByDateRange({
                from: parsedFrom,
                to: parsedTo,
                limit: parseInt(limit),
            });

            const invoicesFormateadas = invoices.map(invoice => ({
                ...invoice,
                date: formatearFechaIso(invoice.date),
            }));

            // Procesar totales
            const cantidadPedidos = invoices.length;
            const productosVendidos = invoices.reduce((acc, f) => {
                return acc + f.order.items.reduce((suma, i) => suma + i.quantity, 0);
            }, 0);
            const ingresosGenerados = invoices.reduce((total, invoice) => total + invoice.amount, 0);


            // Crear workbook y hoja
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Reporte de Facturas');
            

            // Definir columnas con encabezados y ancho
            sheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Fecha', key: 'fecha', width: 15 },
                { header: 'Cliente', key: 'cliente', width: 30 },
                { header: 'Total', key: 'total', width: 15 },
                { header: 'Estado', key: 'estado', width: 15 },
            ];

            // Añadir filas
            invoicesFormateadas.forEach(invoice => {
                sheet.addRow({
                    id: invoice.id,
                    fecha: invoice.date,
                    cliente: invoice.order.user.name,
                    total: invoice.amount,
                    estado: invoice.status,
                });
            });

            // Aplicar formato de moneda
            sheet.getColumn('total').numFmt = '"$"#,##0;[Red]\-"$"#,##0';

            // Estilo para encabezados (fila 1)
            const headerRow = sheet.getRow(1);
            headerRow.eachCell(cell => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFB76E49' }, 
                };
                cell.font = { bold: true, color: { argb: 'FF000000' } }; 
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });

            // Ajustar alto fila encabezado para mejor visual
            headerRow.height = 20;

            // Ajustar alto para filas de datos (opcional)
            sheet.eachRow({ includeEmpty: false }, row => {
                row.alignment = { vertical: 'middle', horizontal: 'left' };
            });

            // Enviar archivo Excel generado como respuesta
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader('Content-Disposition', 'attachment; filename=reporte_facturas.xlsx');

            await workbook.xlsx.write(res);
            res.end();

        } catch (err) {
            console.error('Error al generar Excel:', err);
            res.status(500).json({ error: 'Error al generar el archivo Excel' });
        }
    };
}


export default ReportController;
