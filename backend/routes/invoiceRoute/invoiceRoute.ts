import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler, handleError } from "../../config/config";
import STATUS_CODES from "../../config/status-codes";
import MESSAGES from "../../config/messages";
import logger from "../../logs/logger";
import { sendInvoiceEmail } from "../../config/mails/emailsSender";
import { ClientRecord } from "../../database/Records/Client/ClientRecord";
import { OrdersRecord } from "../../database/Records/Orders/OrdersRecord";
import { InvoiceRecord } from "../../database/Records/Invoices/InvoiceRecord";

const router = express.Router();
router.use(middleware, limiter, errorHandler);
router.use(express.json({ limit: "10mb" }));

router.get("/history", async (req: Request, res: Response) => {
  try {
    const history = await InvoiceRecord.getPaymentHistory();
    return res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({ message: "Błąd podczas pobierania historii płatności." });
  }
});


router.get("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;

  
    const details = await OrdersRecord.getOrderDetails(id);
    return res.status(STATUS_CODES.SUCCESS).json({ details });
  } catch (error) {
    res.status(500).json({ message: "Błąd pobierania szczegółów zamówienia." });
  }
});


router.get("/", async (req: Request, res: Response) => {
    const invoice = await InvoiceRecord.getInvoicesList();
    if (!invoice) return res.status(404).send("Nie znaleziono faktury.");
   return res.status(STATUS_CODES.SUCCESS).json({ invoice });
  });

    /*
    Do zrobienia:
        Paginacja
          Dodaj wsparcie dla LIMIT i OFFSET w zapytaniu SQL, przyjmując parametry page, pageSize
    */


router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const invoice = await InvoiceRecord.getOneById(id);
    if (!invoice) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: "Faktura nie znaleziona." });
    }

    return res.status(STATUS_CODES.SUCCESS).json({ invoice });
  } catch (error) {
    logger.error(`Invoice GET /:id: ${error}`);
    return handleError(res, error, "Invoice GET /:id", MESSAGES.SERVER_ERROR);
  }
});


router.patch("/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

    if (!["unpaid", "waiting", "paid", "overdue"].includes(status)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Nieprawidłowy status." });
    }

  try {
    await InvoiceRecord.updatePaymentStatus(id, status);
    return res.status(STATUS_CODES.SUCCESS).json({ message: "Status faktury zaktualizowany." });
  } catch (error) {
    logger.error(`Invoice PATCH /:id/status: ${error}`);
    return handleError(res, error, "Invoice PATCH /:id/status", MESSAGES.SERVER_ERROR);
  }
});


router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { pdf, clientId, clientAddressId, orderId } = req.body;

    if (!pdf || !clientId || !clientAddressId || !orderId) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Brakuje wymaganych danych.",
      });
    }
  try {
  
    const client = await ClientRecord.getEmailById(clientId);
    if (!client) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: "Nie znaleziono klienta lub adresu email.",
      });
    }

    const pdfBuffer = Buffer.from(pdf);


    const subject = `Faktura za zamówienie ${orderId}`;
    const message = `W załączniku znajduje się faktura dotycząca zamówienia ${orderId}.`;

    const testowy_email = 'karoldawidg@gmail.com';
    const invoiceNumber = `FV/2025/${orderId.slice(0, 8).toUpperCase()}`;

    await InvoiceRecord.insert(orderId, invoiceNumber, pdfBuffer);
    await sendInvoiceEmail(testowy_email, orderId, pdfBuffer);
    await OrdersRecord.updatePaymentStatus(orderId, "waiting");
    logger.info(
      `PDF wysłany do ${client.email} i status płatności zamówienia ${orderId} zaktualizowany na 'waiting'.`
    );
    return res.status(STATUS_CODES.SUCCESS).json({
      message: "Faktura wysłana i status zaktualizowany.",
    });
  } catch (error: any) {
    logger.error(`PDF Route: POST: ${error.message}`);
    return handleError(res, error, "PDF Route: POST", MESSAGES.SERVER_ERROR);
  }
});

router.get("/view/:invoiceId", async (req: Request, res: Response) => {
  const { invoiceId } = req.params;

  console.log(invoiceId);

  try {
    const result = await InvoiceRecord.getPdfById(invoiceId);

    if (!result || !result.pdf) {
      return res.status(404).json({ message: "Faktura nie znaleziona." });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=faktura.pdf");
    res.send(result.pdf);
  } catch (error) {
    logger.error(`Invoice GET /view/:invoiceId: ${error}`);
    return res.status(500).json({ message: "Błąd podczas pobierania faktury PDF." });
  }
});

export default router;