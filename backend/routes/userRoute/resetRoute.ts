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

require('dotenv').config();
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
    oldPassword = user?.password || '';
    
    const secret = jwt_secret + oldPassword;
    const payload: any = jwt.verify(token, secret);

    const hashPassword = await bcrypt.hash(password, 10);

    await UsersRecord.updatePasswordById([hashPassword, id]);

    logger.info(MESSAGES.SUCCESSFUL_RESET);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.PASS_RESET);
  } catch (error:any) {
    logger.error(`Server error: ${error.message}`);
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.JWT_ERROR);
  }
});

export default router;
