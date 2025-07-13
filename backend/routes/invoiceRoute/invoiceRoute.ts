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

export default router;
