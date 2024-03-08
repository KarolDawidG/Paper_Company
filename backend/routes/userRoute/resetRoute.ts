import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import middleware from "../../config/middleware";
import { limiter, errorHandler } from "../../config/config";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import logger from "../../logs/logger";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import { validatePassword } from "../../config/config";

require("dotenv").config();
const jwt_secret = process.env.jwt_secret;
const router = express.Router();

router.use(middleware);
router.use(limiter);
router.use(errorHandler);

router.get("/:id/:token", (req: Request, res: Response) => {
  try {
    res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error) {
    logger.error(error);
  }
});

router.post("/:id/:token", async (req: Request, res: Response) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;
  let oldPassword = "";

  if (password !== password2 || !validatePassword(password)) {
    return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.INVALID_PASS);
  }

  try {
    const [user]: any = await UsersRecord.selectById([id]);
    oldPassword = user?.password || "";

    const secret = jwt_secret + oldPassword;
    const payload: any = jwt.verify(token, secret);

    const hashPassword = await bcrypt.hash(password, 10);

    await UsersRecord.updatePasswordById([hashPassword, id]);

    logger.info(MESSAGES.SUCCESSFUL_RESET);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.PASS_RESET);
  } catch (error: any) {
    logger.error(`Server error: ${error.message}`);
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.JWT_ERROR);
  }
});

/**
 * @swagger
 * tags:
 *   name: Password Reset
 *   description: Endpointy do resetowania hasła użytkownika
 */

/**
 * @swagger
 * /reset/{id}/{token}:
 *   get:
 *     summary: Zwraca informacje o resetowaniu hasła.
 *     description: Zwraca informacje o tym, że resetowanie hasła przebiegło pomyślnie.
 *     tags: [Password Reset]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identyfikator użytkownika.
 *         schema:
 *           type: string
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token resetujący hasło.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informacje o pomyślnym resetowaniu hasła.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat o pomyślnym resetowaniu hasła.
 */

/**
 * @swagger
 * /reset/{id}/{token}:
 *   post:
 *     summary: Resetuje hasło użytkownika.
 *     description: Resetuje hasło użytkownika na podstawie otrzymanego tokenu resetującego.
 *     tags: [Password Reset]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identyfikator użytkownika.
 *         schema:
 *           type: string
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token resetujący hasło.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Nowe hasło użytkownika.
 *               password2:
 *                 type: string
 *                 description: Potwierdzenie nowego hasła użytkownika.
 *     responses:
 *       200:
 *         description: Pomyślnie zresetowano hasło użytkownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat o pomyślnym zresetowaniu hasła.
 *       400:
 *         description: Nieprawidłowe żądanie lub hasło nie spełnia wymagań.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 *       500:
 *         description: Błąd serwera podczas resetowania hasła.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu serwera.
 */

export default router;
