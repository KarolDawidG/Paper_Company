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
    console.log('test');
    const ifUser: RowDataPacket[] = (await UsersRecord.selectByUsername(user)) as RowDataPacket[];
      if (ifUser.length === 0) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .send(MESSAGES.UNPROCESSABLE_ENTITY);
      }
      console.log(ifUser);

    const idUser: any = ifUser[0]?.id;
    console.log(idUser)
    if (!idUser) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.UNPROCESSABLE_ENTITY);
    }

    if (!ifUser[0].is_active) {
      return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.FORBIDDEN);
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
