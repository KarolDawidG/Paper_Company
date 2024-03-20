import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import {
  errorHandler,
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

router.post("/", limiterLogin, async (req: Request, res: Response) => {
  let idUser: string | undefined;

  try {
    const user: string = req.body.username;
    const password: string = req.body.password;

    if (!user || !password) {
      return res
        .status(STATUS_CODES.UNPROCESSABLE_ENTITY)
        .send(MESSAGES.UNPROCESSABLE_ENTITY);
    }
    // if (!user.match(queryParameterize)) {
    //   return res
    //     .status(STATUS_CODES.BAD_REQUEST)
    //     .send(MESSAGES.SQL_INJECTION_ALERT);
    // }

    const ifUser = await UsersRecord.selectByUsername([user]);

    if (Array.isArray(ifUser)) {
      if (ifUser.length === 0) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .send(MESSAGES.UNPROCESSABLE_ENTITY);
      }
      if ("id" in ifUser[0]) {
        idUser = ifUser[0]?.id;
      } else {
        console.log("Brak pola 'id' w obiekcie użytkownika");
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .send(MESSAGES.UNPROCESSABLE_ENTITY);
      }
    } else {
      console.log("Nie otrzymano oczekiwanej tablicy użytkowników");
    }

    if (!idUser) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.UNPROCESSABLE_ENTITY);
    }

    if (
      Array.isArray(ifUser) &&
      ifUser.length > 0 &&
      "is_active" in ifUser[0]
    ) {
      if (!ifUser[0].is_active) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.FORBIDDEN);
      }
    } else {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.UNPROCESSABLE_ENTITY);
    }

    const hashedPassword: string = ifUser[0].password;
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      hashedPassword,
    );

    if (!isPasswordValid) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.UNPROCESSABLE_ENTITY);
    }

    const rola: string = ifUser[0].role;
    logger.info(`Logged in user: ${user}, access level: ${rola}`);

    const token: string = generateToken(user, rola);
    const refreshToken: string = generateRefreshToken(user, rola);

    await UsersRecord.updateRefreshTokenById([refreshToken, idUser]);

    return res.status(STATUS_CODES.SUCCESS).json({
      token: token,
      idUser: idUser,
      message: MESSAGES.SUCCESSFUL_SIGN_UP,
    });
  } catch (error: any) {
    logger.error(`Login Route: POST: ${error.message}`);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Login Route: POST: ${MESSAGES.INTERNET_DISCONNECTED}`);
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  const idUser: string = req.body.idUser;

  const userInfo: any = await UsersRecord.selectTokenById([idUser]);
  const refreshToken = userInfo[0]?.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ message: MESSAGES.NO_REFRESH_TOKEN });
  }
  jwt.verify(refreshToken, SECRET_REFRESH_TOKEN, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: MESSAGES.INVALID_REFRESH_TOKEN });
    }
    const username: string = decoded.user;
    const role: string = decoded.role;
    const newToken: string = generateToken(username, role);
    const newRefreshToken: string = generateRefreshToken(username, role);

    UsersRecord.updateRefreshTokenById([newRefreshToken, idUser]);

    return res.json({ token: newToken });
  });
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
