import express, { Request, Response, Router } from "express";
import { RowDataPacket } from "mysql2/promise";
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
  let idUser: string | undefined; // Deklaracja zmiennej poza blokiem try

  try {
    const user: string = req.body.username;
    const password: string = req.body.password;

    if (!user || !password) {
      return res
        .status(STATUS_CODES.UNPROCESSABLE_ENTITY)
        .send(MESSAGES.UNPROCESSABLE_ENTITY);
    }
    if (!user.match(queryParameterize)) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(MESSAGES.SQL_INJECTION_ALERT);
    }
    
    const ifUser = await UsersRecord.selectByUsername([user]);  

    if (Array.isArray(ifUser)) {
      if (ifUser.length === 0) {
        // Obsługa, gdy ifUser jest pustą tablicą
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .send(MESSAGES.UNPROCESSABLE_ENTITY);
      }
    
      // Użycie type guard, aby sprawdzić, czy ifUser[0] zawiera pole id
      if ('id' in ifUser[0]) {
        idUser = ifUser[0]?.id; // Przypisanie wartości do zmiennej idUser
        
      } else {
        console.log("Brak pola 'id' w obiekcie użytkownika");
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .send(MESSAGES.UNPROCESSABLE_ENTITY);
      }
    } else {
      console.log("Nie otrzymano oczekiwanej tablicy użytkowników");
    }
    

    // Sprawdzenie, czy idUser ma wartość przed jego użyciem
    if (!idUser) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.UNPROCESSABLE_ENTITY);
    }

    if (Array.isArray(ifUser) && ifUser.length > 0 && 'is_active' in ifUser[0]) {
      if (!ifUser[0].is_active) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.FORBIDDEN);
      }
    } else {
      // Obsługa przypadku, gdy ifUser nie jest tablicą lub nie zawiera odpowiednich danych
      return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.UNPROCESSABLE_ENTITY);
    }
    

    const hashedPassword: string = ifUser[0].password;
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      hashedPassword
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
      refreshToken: refreshToken,
      idUser: idUser,
      message: MESSAGES.SUCCESSFUL_SIGN_UP,
    });
  } catch (error:any) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(MESSAGES.INTERNET_DISCONNECTED);
  }
});

router.post("/refresh", (req: Request, res: Response) => {
  const refreshToken: string = req.body.refreshToken;
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
    return res.json({ token: newToken, refreshToken: newRefreshToken });
  });
});

export default router;
