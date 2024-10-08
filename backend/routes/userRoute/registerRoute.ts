import express, { Request, Response } from "express";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import middleware from "../../config/middleware";
import { errorHandler, handleError } from "../../config/config";
import MESSAGES from "../../config/messages";
import URL from "../../config/url";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { validatePassword } from "../../config/config";
import { sendRegisterEmail } from "../../config/mails/emailsSender";

require("dotenv").config();
const JWT_CONFIRMED_TOKEN = process.env.JWT_CONFIRMED_TOKEN;

const router = express.Router();
router.use(middleware);
router.use(errorHandler);

router.post("/", async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
    if (!validatePassword(password)) {
      return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.INVALID_PASS);
    }
  try {
    const userExists = {
      emailExists: await UsersRecord.selectByEmail([email]),
      loginExists: await UsersRecord.selectByUsername([username]),
    };
      if (
        Array.isArray(userExists.emailExists) &&
        userExists.emailExists.length > 0
      ) {
        return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.EMAIL_EXIST);
      }
      if (
        Array.isArray(userExists.loginExists) &&
        userExists.loginExists.length > 0
      ) {
        return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.USER_EXIST);
      }
    const hashPassword = await bcrypt.hash(password, 10);
    const idActivation = await UsersRecord.insert(
      username,
      hashPassword,
      email,
    );
    const activationToken = jwt.sign(
      { userId: idActivation },
      JWT_CONFIRMED_TOKEN!,
      { expiresIn: "5m" },
    );
    const link = `${URL.REGISTER_URL}${activationToken}`;
    await sendRegisterEmail(email, username, link);
    logger.info(MESSAGES.SUCCESSFUL_SIGN_UP);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_SIGN_UP);
  } catch (error: any) {
    return handleError(res, error, "Register Route: POST", MESSAGES.SERVER_ERROR);
  }
});

router.get("/:token", async (req: Request, res: Response) => {
  const { token } = req.params;
    try {
      jwt.verify(token, JWT_CONFIRMED_TOKEN!, async (err: any, decoded: any) => {
        if (err) {
          return handleError(res, err, "Register Route /token: GET: jwt.verify", MESSAGES.JWT_ERROR, STATUS_CODES.UNAUTHORIZED);
        }
        const id = decoded.userId;
        await UsersRecord.activateAccount(id);
        return res.status(STATUS_CODES.REDIRECT).redirect(URL.URL_LOGIN);
      });
    } catch (error: any) {
      return handleError(res, error, "Register Route: GET", MESSAGES.SERVER_ERROR);
    }
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Rejestruje nowego użytkownika.
 *     description: Endpoint do rejestracji nowego użytkownika w systemie.
 *     tags: [Register]
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
 *               username:
 *                 type: string
 *                 description: Nazwa użytkownika.
 *               password:
 *                 type: string
 *                 description: Hasło użytkownika.
 *     responses:
 *       200:
 *         description: Pomyślnie zarejestrowano użytkownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat potwierdzający rejestrację.
 *                   example: "Registration completed successfully. Welcome to our community."
 *       400:
 *         description: Błędne żądanie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 *                   example: "The password must be between 8 and 16 characters long, and include one uppercase letter and a digit."
 *       403:
 *         description: Adres email lub nazwa użytkownika już istnieją.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 *                   example: "The email address is already in use. Please choose another."
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
 *                   example: "Server encountered an error. Please contact the administrator for support."
 */

/**
 * @swagger
 * /register/{token}:
 *   get:
 *     summary: Aktywuje konto użytkownika.
 *     description: Endpoint do aktywacji konta użytkownika na podstawie tokena.
 *     tags: [Register]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token aktywacyjny.
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Pomyślnie aktywowano konto użytkownika. Użytkownik jest przekierowywany do strony logowania.
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               description: URL do strony logowania.
 *               example: "https://example.com/login"
 *       401:
 *         description: Błąd uwierzytelniania.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 *                   example: "Authorization failed due to an invalid JsonWebToken signature."
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
 *                   example: "Server encountered an error. Please contact the administrator for support."
 */

export default router;
