import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import middleware from "../../config/middleware";
import { errorHandler } from "../../config/config";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import { sendResetPasswordEmail } from "../../config/emailSender";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import URL from "../../config/url";
import logger from "../../logs/logger";
require("dotenv").config();

const jwt_secret: string = process.env.jwt_secret || "";

const router: Router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.post("/", async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  let usernameReset: string = "";
  let idReset: string = "";
  let emailReset: string = "";
  let passwordReset: string = "";

  try {
    const [emailExists]: any = await UsersRecord.selectByEmail([email]);
    if (!emailExists || emailExists.length === 0) {
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.EMAIL_SUCCESS);
    }
    usernameReset = emailExists.username;
    emailReset = emailExists.email;
    idReset = emailExists.id;
    passwordReset = emailExists.password;
  } catch (error: any) {
    logger.error(error.message);
    res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }

  const secret: string = jwt_secret + passwordReset;
  const payload: { email: string; id: string } = {
    email: emailReset,
    id: idReset,
  };
  const token: string = jwt.sign(payload, secret, { expiresIn: "1m" });
  const link: string = `${URL.RESET_URL}${idReset}/${token}`;

  await sendResetPasswordEmail(emailReset, usernameReset, link);

  try {
    logger.info(MESSAGES.EMAIL_SUCCESS);
    res.status(STATUS_CODES.SUCCESS).send(MESSAGES.EMAIL_SUCCESS);
  } catch (error: any) {
    logger.error(`Server error email route: ${error.message}`);
    res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

/**
 * @swagger
 * tags:
 *   name: Forgot Password
 *   description: Endpointy do obsługi przypomnienia hasła
 */

/**
 * @swagger
 * /forgot:
 *   post:
 *     summary: Wysyła email resetujący hasło.
 *     description: Endpoint do wysyłania emaila z linkiem resetującym hasło użytkownika.
 *     tags: [Forgot Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adres email użytkownika.
 *     responses:
 *       200:
 *         description: Pomyślnie wysłano email resetujący hasło.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat potwierdzający wysłanie emaila.
 *       500:
 *         description: Błąd serwera.
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
