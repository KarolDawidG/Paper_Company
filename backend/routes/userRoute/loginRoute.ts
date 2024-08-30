import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import {
  errorHandler,
  handleError,
  limiterLogin,
  queryParameterize,
} from "../../config/config";
import middleware from "../../config/middleware";

import {
  SECRET_REFRESH_TOKEN,
  generateRefreshToken,
  generateToken,
} from "../../config/tokenUtils";
import MESSAGES from "../../config/messages";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";

const router: Router = express.Router();

router.use(middleware);
router.use(errorHandler);


interface UserInterface {
  id: string,
  is_active: number,
  role: string,
  password: string
}

router.post("/", limiterLogin, async (req: Request, res: Response) => {
  const { username: user, password } = req.body;

  if (!user || !password) {
    logger.warn("Login Route: POST: Missing username or password.");
    return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send(MESSAGES.UNPROCESSABLE_ENTITY);
  }

  try {
    const users = await UsersRecord.selectByUsername([user]) as UserInterface[];

    if (!Array.isArray(users) || users.length === 0) {
      logger.warn(`Login Route: POST: User not found. Username: ${user}`);
      return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.UNPROCESSABLE_ENTITY);
    }

    const userRecord = users[0];

    if (!userRecord.is_active) {
      logger.warn(`Login Route: POST: User is inactive. Username: ${user}`);
      return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.FORBIDDEN);
    }

    const isPasswordValid = await bcrypt.compare(password, userRecord.password);

    if (!isPasswordValid) {
      logger.warn(`Login Route: POST: Wrong password. Username: ${user}`);
      return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.UNPROCESSABLE_ENTITY);
    }

    const token = generateToken(user, userRecord.role);
    const refreshToken = generateRefreshToken(user, userRecord.role);

    await UsersRecord.updateRefreshTokenById([refreshToken, userRecord.id]);

    logger.info(`Logged in user: ${user}, access level: ${userRecord.role}`);
    return res.status(STATUS_CODES.SUCCESS).json({
      token,
      idUser: userRecord.id,
      message: MESSAGES.SUCCESSFUL_SIGN_UP,
    });
  } catch (error) {
    return handleError(res, error, "Login Route: POST", MESSAGES.SERVER_ERROR);
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  const { idUser } = req.body;
    if (!idUser) {
      return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send(MESSAGES.MISSING_ID_USER);
    }
  try {
    const userInfo: any = await UsersRecord.selectTokenById([idUser]);
      if (userInfo.length === 0) {
        return res.status(STATUS_CODES.NOT_FOUND).send(MESSAGES.USER_NOT_FOUND);
      }

    const refreshToken = userInfo[0]?.refresh_token;
      if (!refreshToken) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.NO_REFRESH_TOKEN);
      }

    jwt.verify(refreshToken, SECRET_REFRESH_TOKEN, (err: any, decoded: any) => {
      if (err) {
        return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.INVALID_REFRESH_TOKEN);
      }

      const { user: username, role } = decoded;
      const newToken: string = generateToken(username, role);
      const newRefreshToken: string = generateRefreshToken(username, role);
    
      UsersRecord.updateRefreshTokenById([newRefreshToken, idUser])
        .then(() => {
          return res.json({ token: newToken });
        })
        .catch((error) => {
          logger.error(`Refresh Route: POST: Error updating refresh token for user ID: ${idUser}`, error);
          return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
        });
    });

  } catch (error:any) {
      return handleError(res, error, "Refresh Route: POST", MESSAGES.SERVER_ERROR);
  }



});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpointy do obsługi logowania uzytkownika.
 */

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Logowanie użytkownika
 *     description: Loguje użytkownika i zwraca token dostępowy.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nazwa użytkownika.
 *               password:
 *                 type: string
 *                 description: Hasło użytkownika.
 *     responses:
 *       200:
 *         description: Pomyślnie zalogowano użytkownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token dostępowy.
 *                 idUser:
 *                   type: string
 *                   description: Identyfikator użytkownika.
 *                 message:
 *                   type: string
 *                   description: Komunikat powitalny.
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
 *       401:
 *         description: Błędna nazwa użytkownika lub hasło.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 *       403:
 *         description: Konto nieaktywne lub zablokowane.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 *       422:
 *         description: Nieprawidłowe dane wejściowe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
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

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Odśwież token dostępowy
 *     description: Odświeża token dostępowy użytkownika na podstawie tokena odświeżającego.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: string
 *                 description: Identyfikator użytkownika.
 *     responses:
 *       200:
 *         description: Pomyślnie odświeżono token dostępowy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Nowy token dostępowy.
 *       401:
 *         description: Brak tokena odświeżającego lub błąd weryfikacji.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Komunikat błędu.
 *       403:
 *         description: Nieprawidłowy token odświeżający.
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
