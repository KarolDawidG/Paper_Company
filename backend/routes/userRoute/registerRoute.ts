import express, { Request, Response } from "express";
import { RowDataPacket } from "mysql2/promise";
import { UsersRecord } from "../../database/Records/Users/UsersRecord";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import middleware from "../../config/middleware";
import { errorHandler } from "../../config/config";
import MESSAGES from "../../config/messages";
import URL from "../../config/url";
import STATUS_CODES from "../../config/status-codes";
import logger from "../../logs/logger";
import { validatePassword } from "../../config/config";
import { sendRegisterEmail } from "../../config/emailSender";

require('dotenv').config();
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

    if (Array.isArray(userExists.emailExists) && userExists.emailExists.length > 0) {
      return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.EMAIL_EXIST);
    }
    
    if (Array.isArray(userExists.loginExists) && userExists.loginExists.length > 0) {
      return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.USER_EXIST);
    }
    

    const hashPassword = await bcrypt.hash(password, 10);
    const idActivation = await UsersRecord.insert(username, hashPassword, email);
    const activationToken = jwt.sign({ userId: idActivation }, JWT_CONFIRMED_TOKEN!, { expiresIn: "5m" });
    const link = `${URL.REGISTER_URL}${activationToken}`;

    await sendRegisterEmail(email, username, link);

    logger.info(MESSAGES.SUCCESSFUL_SIGN_UP);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_SIGN_UP);
  } catch (error:any) {
    logger.error(error.message);
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

router.get("/:token", async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    jwt.verify(token, JWT_CONFIRMED_TOKEN!, async (err: any, decoded: any) => {
      if (err) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.JWT_ERROR);
      }

      const id = decoded.userId;
      await UsersRecord.activateAccount(id);

      return res.redirect(URL.URL_LOGIN);
    });
  } catch (error:any) {
    logger.error(`Server error: ${error.message}`);
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

export default router;
