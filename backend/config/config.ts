import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import MESSAGES from "./messages";
import STATUS_CODES from "./status-codes";
import logger from "../logs/logger";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userRole?: string;
  user?: any;
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  logger.error(err.message);
  return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.INVALID_REQUEST);
};

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, //5 minutes
  max: 1000, // limit each IP to 100 per windowMs
});

const limiterLogin = rateLimit({
  windowMs: 5 * 60 * 1000, //5 minutes
  max: 50,
});

export const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

if (!fs.existsSync("./klucze")) {
  fs.mkdirSync("./klucze");
}

fs.writeFileSync("./klucze/privateKey.pem", privateKey);
fs.writeFileSync("./klucze/publicKey.pem", publicKey);

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader: any = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send(MESSAGES.USER_NOT_LOGGED_IN);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      logger.info(MESSAGES.JWT_ERROR);
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.SESSION_EXPIRED);
    }
    req.userRole = (decoded as any).role; // Teraz TypeScript wie o `userRole`
    req.user = decoded; // I o `user` :p
    next();
  });
};

const queryParameterize = /^[A-Za-z0-9]+$/;

const validateEmail = (e: string) => {
  const email = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  return email.test(e);
};

const validatePassword = (e: string) => {
  if (e.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(e)) {
    return false;
  }
  if (!/[0-9]/.test(e)) {
    return false;
  }
  return true;
};

const validateUserName = (e: string) => {
  if (e.length >= 6 && e.length <= 16) {
    return true;
  } else {
    return false;
  }
};

const handleError = (
  res: Response,
  error: any,
  route: string,
  message: string,
  statusCode: number = STATUS_CODES.SERVER_ERROR,
  id?: string
) => {
  if (id) {
    logger.error(`${route}: Error with ID ${id}. Error: ${error.message}`);
    return res.status(statusCode).send(`${message} (ID: ${id})`);
  } else {
    logger.error(`${route}: ${message}. Error: ${error.message}`);
    return res.status(statusCode).send(message);
  }
};

const handleWarning = (
  res: Response,
  route: string,
  message: string,
  statusCode: number = STATUS_CODES.NOT_FOUND,
  id?: string
) => {
  if (id) {
    logger.warn(`${route}: Warning with ID ${id}. Message: ${message}`);
  } else {
    logger.warn(`${route}: ${message}`);
  }

  return res.status(statusCode).send(message);
};

function handleNoRecordsModified(res: Response, route: string, id: string, result: any): Response | void {
  if (result.affectedRows === 0) {
    return handleWarning(res, `${route}`, MESSAGES.NO_RECORDS_MODIFIED, STATUS_CODES.NOT_FOUND, id);
  }
}

const generateTokenForUnitTest = (role: string) => jwt.sign({ role }, privateKey, { algorithm: 'RS256' });

export {
  errorHandler,
  limiter,
  limiterLogin,
  queryParameterize,
  validateEmail,
  validatePassword,
  validateUserName,
  verifyToken,
  handleError,
  handleWarning,
  handleNoRecordsModified,
  generateTokenForUnitTest,
};
