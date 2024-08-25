import express, { Request, Response, Router } from "express";
import middleware from "../../config/middleware";
import { errorHandler } from "../../config/config";
import { sendContactEmail } from "../../config/mails/emailSender";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";

const router: Router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.post("/", async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  await sendContactEmail(name, email, subject, message);

  try {
    logger.info("An E-mail has been sent!");
    res.status(STATUS_CODES.SUCCESS).send("An E-mail has been sent!");
  } catch (error: any) {
    logger.error(`Server error contact route: ${error.message}`);
    res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Endpointy do obsługi formularza kontaktowego
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Wysyła e-mail z formularza kontaktowego.
 *     description: Endpoint do wysyłania wiadomości e-mail z formularza kontaktowego.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Imię i nazwisko osoby kontaktującej się.
 *               email:
 *                 type: string
 *                 description: Adres e-mail osoby kontaktującej się.
 *               subject:
 *                 type: string
 *                 description: Temat wiadomości.
 *               message:
 *                 type: string
 *                 description: Treść wiadomości.
 *     responses:
 *       200:
 *         description: Pomyślnie wysłano e-mail.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Potwierdzenie wysłania e-maila.
 *       500:
 *         description: Błąd serwera podczas wysyłania e-maila.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 */

export default router;
