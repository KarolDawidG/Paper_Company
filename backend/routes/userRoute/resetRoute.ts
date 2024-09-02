import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import middleware from "../../config/middleware";
import { limiter, errorHandler, handleError, handleWarning } from "../../config/config";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import logger from "../../logs/logger";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import { validatePassword } from "../../config/config";

require("dotenv").config();
const jwt_secret = process.env.jwt_secret || "";
const router = express.Router();

router.use(middleware);
router.use(limiter);
router.use(errorHandler);

router.get("/:id/:token", (req: Request, res: Response) => {
  try {
    res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error) {
    return handleError(res, error, "Reset Route /:id/:token: GET", MESSAGES.SERVER_ERROR);
  }
});

router.post("/:id/:token", async (req: Request, res: Response) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;

  if (!password || !password2) {
    return handleWarning(res, `Reset Route: POST`, MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  if (password !== password2) {
    return handleWarning(res, `Reset Route: POST`, MESSAGES.PASSWORDS_DO_NOT_MATCH, STATUS_CODES.BAD_REQUEST);
  }

  if (!validatePassword(password)) {
    return handleWarning(res, `Reset Route: POST`, MESSAGES.INVALID_PASS, STATUS_CODES.BAD_REQUEST);
  }

  try {
    const [user]: any = await UsersRecord.selectById(id);

    if (!user) {
      return handleWarning(res, `Reset Route: POST: User not found. ID: ${id}`, MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const oldPassword = user.password || "";
    const secret = jwt_secret + oldPassword;

    jwt.verify(token, secret, async (err: any, decoded: any) => {
      if (err) {
        return handleError(res, err, `Reset Route: POST: Token verification failed. ID: ${id}`, MESSAGES.INVALID_TOKEN, STATUS_CODES.UNAUTHORIZED);
      }

      const hashPassword = await bcrypt.hash(password, 10);
      await UsersRecord.updatePasswordById([hashPassword, id]);

      logger.info(MESSAGES.SUCCESSFUL_RESET);
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_RESET);
    });
  } catch (error: any) {
    return handleError(res, error, "Reset Route: POST", MESSAGES.SERVER_ERROR);
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
 *                   example: "Password reset operation was successful."
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
 *                 example: "NewPassword123!"
 *               password2:
 *                 type: string
 *                 description: Potwierdzenie nowego hasła użytkownika.
 *                 example: "NewPassword123!"
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
 *                   example: "Password has been successfully reset."
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
 *                   example: "Passwords do not match or do not meet the requirements."
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
 *                   example: "Server encountered an error while resetting the password."
 */ 

export default router;
