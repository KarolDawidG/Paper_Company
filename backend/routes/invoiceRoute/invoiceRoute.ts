import express, { Request, Response, NextFunction } from "express";
import middleware from "../../config/middleware";
import { limiter, errorHandler, handleError, handleWarning, requireRoles, verifyToken } from "../../config/config";
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

// 27.8.5: Operacje na fakturach są ograniczone do księgowości i administratora.
router.get("/history", verifyToken, requireRoles("accounting", "admin"), async (req: Request, res: Response) => {
  try {
    const history = await InvoiceRecord.getPaymentHistory();
    return res.status(STATUS_CODES.SUCCESS).json({ history });
  } catch (error: any) {
    // 27.10.5.5: Historia płatności używa wspólnego handleError zamiast ręcznego 500 z własnym komunikatem.
    return handleError(res, error, "Invoice Route /history: GET", MESSAGES.SERVER_ERROR);
  }
});


router.get("/details/:id", verifyToken, requireRoles("accounting", "admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const details = await OrdersRecord.getOrderDetails(id);
    return res.status(STATUS_CODES.SUCCESS).json({ details });
  } catch (error: any) {
    // 27.10.5.6: Szczegóły zamówienia do faktury zwracają błędy tym samym mechanizmem co reszta modułu.
    return handleError(res, error, "Invoice Route /details/:id: GET", MESSAGES.SERVER_ERROR);
  }
});


router.get("/", verifyToken, requireRoles("accounting", "admin"), async (req: Request, res: Response) => {
    try {
      const invoice = await InvoiceRecord.getInvoicesList();
      if (!invoice) {
        // 27.10.5.7: Brak faktur raportujemy przez handleWarning, żeby 404 było spójne z innymi route'ami.
        return handleWarning(res, "Invoice Route: GET", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }
      return res.status(STATUS_CODES.SUCCESS).json({ invoice });
    } catch (error: any) {
      return handleError(res, error, "Invoice Route: GET", MESSAGES.SERVER_ERROR);
    }
  });

    /*
    Do zrobienia:
        Paginacja
          Dodaj wsparcie dla LIMIT i OFFSET w zapytaniu SQL, przyjmując parametry page, pageSize
    */


router.get("/:id", verifyToken, requireRoles("accounting", "admin"), async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const invoice = await InvoiceRecord.getOneById(id);
    if (!invoice) {
      return handleWarning(res, "Invoice GET /:id", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND, id);
    }

    return res.status(STATUS_CODES.SUCCESS).json({ invoice });
  } catch (error) {
    logger.error(`Invoice GET /:id: ${error}`);
    return handleError(res, error, "Invoice GET /:id", MESSAGES.SERVER_ERROR);
  }
});


router.patch("/:id/status", verifyToken, requireRoles("accounting", "admin"), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

    if (!["unpaid", "waiting", "paid", "overdue"].includes(status)) {
      // 27.10.5.8: Nieprawidłowy status faktury przechodzi przez handleWarning z kodem 400 zamiast ręcznego json.
      return handleWarning(res, "Invoice PATCH /:id/status", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST, id);
    }

  try {
    await InvoiceRecord.updatePaymentStatus(id, status);
    return res.status(STATUS_CODES.SUCCESS).json({ message: "Status faktury zaktualizowany." });
  } catch (error) {
    logger.error(`Invoice PATCH /:id/status: ${error}`);
    return handleError(res, error, "Invoice PATCH /:id/status", MESSAGES.SERVER_ERROR);
  }
});


router.post("/", verifyToken, requireRoles("accounting", "admin"), async (req: Request, res: Response, next: NextFunction) => {
  const { pdf, clientId, clientAddressId, orderId } = req.body;

    if (!pdf || !clientId || !clientAddressId || !orderId) {
      // 27.10.5.9: Walidacja wejścia przy generowaniu faktury używa wspólnego komunikatu BAD_REQUEST.
      return handleWarning(res, "Invoice Route: POST", MESSAGES.BAD_REQUEST, STATUS_CODES.BAD_REQUEST);
    }
  try {
  
    const client = await ClientRecord.getEmailById(clientId);
    if (!client) {
      // 27.10.5.10: Brak klienta lub e-maila jest zgłaszany jednolicie jako 404 przez handleWarning.
      return handleWarning(res, "Invoice Route: POST", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND, clientId);
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

router.post("/resend/:id", verifyToken, requireRoles("accounting", "admin"), async (req: Request, res: Response) => {
  const { id } = req.params;
  const testowy_email = "karoldawidg@gmail.com"; 

  try {
    // Pobierz fakturę
    const invoice = await InvoiceRecord.getInvoiceWithClientEmail(id);
    if (!invoice || !invoice.pdf || !invoice.client_email || !invoice.order_id) {
      // 27.10.5.11: Ponowna wysyłka faktury ma teraz spójne 404 i 500 jak reszta modułu.
      return handleWarning(res, "Invoice Route /resend/:id: POST", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND, id);
    }

    const subject = `Faktura za zamówienie ${invoice.order_id}`;
    const message = `W załączniku znajduje się faktura dotycząca zamówienia ${invoice.order_id}.`;

    await sendInvoiceEmail(testowy_email, invoice.order_id, invoice.pdf);

    logger.info(`Faktura ${id} ponownie wysłana do klienta ${invoice.client_email}`);
    return res.status(STATUS_CODES.SUCCESS).json({ message: "Faktura została ponownie wysłana." });
  } catch (error: any) {
    logger.error(`Invoice POST /resend/:id: ${error}`);
    return handleError(res, error, "Invoice Route /resend/:id: POST", MESSAGES.SERVER_ERROR);
  }
});
    

router.get("/view/:invoiceId", verifyToken, requireRoles("accounting", "admin"), async (req: Request, res: Response) => {
  const { invoiceId } = req.params;

  try {
    const result = await InvoiceRecord.getPdfById(invoiceId);

    if (!result || !result.pdf) {
      // 27.10.5.12: Podgląd PDF korzysta z handleWarning/handleError zamiast ręcznych odpowiedzi mieszanych ze statusem 404/500.
      return handleWarning(res, "Invoice GET /view/:invoiceId", MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND, invoiceId);
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=faktura.pdf");
    res.send(result.pdf);
  } catch (error: any) {
    logger.error(`Invoice GET /view/:invoiceId: ${error}`);
    return handleError(res, error, "Invoice GET /view/:invoiceId", MESSAGES.SERVER_ERROR);
  }
});

export default router;
