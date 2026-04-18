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
  // 27.11.3: Globalny error handler zapisuje błąd tylko przez winston, żeby nie mieszać console.error z loggerem.
  logger.error("Unhandled middleware error on %s %s: %s", req.method, req.originalUrl, err);
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
      logger.warn("Token verification failed on %s %s: %s", req.method, req.originalUrl, MESSAGES.JWT_ERROR);
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.SESSION_EXPIRED);
    }
    // 777 superuser fix: Normalizujemy rolę z tokenu do małych liter, żeby porównania były odporne na zapis w bazie.
    req.userRole = normalizeString((decoded as any).role).toLowerCase();
    // 27.10.10.3: Zdekodowany token trzymamy na req.user, żeby middleware uprawnień miały jedno źródło danych użytkownika.
    req.user = decoded;
    next();
  });
};

const requireSelfOrAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const resourceId = req.params.id;
  const authenticatedUserId = req.user?.userId;

  // 777 superuser: Rola deweloperska ma pełny dostęp do własnych zasobów i zasobów innych użytkowników.
  if (
    req.userRole === "admin" ||
    req.userRole === "superuser" ||
    `${authenticatedUserId}` === `${resourceId}`
  ) {
    return next();
  }

  return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.FORBIDDEN);
};

const requireRoles =
  (...roles: string[]) =>
  (req: CustomRequest, res: Response, next: NextFunction) => {
    // 777 superuser: Rola testowa omija bramki modułowe, żeby dało się przejść cały system jednym kontem.
    if (req.userRole === "superuser") {
      return next();
    }
    // 27.8.1: Moduły biznesowe mają jawnie wskazane role zamiast samego "czy token istnieje".
    if (req.userRole && roles.includes(req.userRole)) {
      return next();
    }

    return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.FORBIDDEN);
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

const normalizeString = (value: unknown): string => {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number") {
    return `${value}`.trim();
  }
  return "";
};

const isNonEmptyString = (value: unknown): boolean => {
  return normalizeString(value).length > 0;
};

const areNonEmptyStrings = (...values: unknown[]): boolean => {
  return values.every((value) => isNonEmptyString(value));
};

const maskEmail = (value: string): string => {
  const normalizedValue = normalizeString(value);
  const [localPart, domain] = normalizedValue.split("@");

  if (!localPart || !domain) {
    return normalizedValue;
  }

  const visiblePrefix = localPart.slice(0, 2);
  return `${visiblePrefix}${"*".repeat(Math.max(localPart.length - 2, 1))}@${domain}`;
};

const sanitizeLogValue = (value: unknown): string => {
  const normalizedValue =
    value instanceof Error ? `${value.name}: ${value.message}` : `${value ?? ""}`;

  return normalizedValue
    .replace(/Bearer\s+[A-Za-z0-9\-_.]+/gi, "Bearer [REDACTED]")
    .replace(/(refresh[_-\s]?token["'=:\s]*)[A-Za-z0-9\-_.]+/gi, "$1[REDACTED]")
    .replace(/(token["'=:\s]*)[A-Za-z0-9\-_.]+/gi, "$1[REDACTED]")
    .replace(/(password["'=:\s]*)[^,\s]+/gi, "$1[REDACTED]")
    .replace(/(secret["'=:\s]*)[^,\s]+/gi, "$1[REDACTED]")
    .replace(/([A-Z0-9._%+-]{2})[A-Z0-9._%+-]*@([A-Z0-9.-]+\.[A-Z]{2,})/gi, "$1***@$2");
};

const handleError = (
  res: Response,
  error: any,
  route: string,
  message: string,
  statusCode: number = STATUS_CODES.SERVER_ERROR,
  id?: string
) => {
  const safeRoute = sanitizeLogValue(route);
  const safeError = sanitizeLogValue(error);
  const safeId = id ? sanitizeLogValue(id) : undefined;

  if (id) {
    // 27.11.22: Centralny helper błędów redaguje tokeny, hasła i maile, zanim trafią do logów winston.
    logger.error(`${safeRoute}: Error with ID ${safeId}. Error: ${safeError}`);
    return res.status(statusCode).send(`${message} (ID: ${id})`);
  } else {
    logger.error(`${safeRoute}: ${message}. Error: ${safeError}`);
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
  const safeRoute = sanitizeLogValue(route);
  const safeId = id ? sanitizeLogValue(id) : undefined;

  if (id) {
    // 27.11.23: Ostrzeżenia przechodzą przez tę samą sanitację, żeby logi walidacyjne nie ujawniały wrażliwych wartości.
    logger.warn(`${safeRoute}: Warning with ID ${safeId}. Message: ${message}`);
  } else {
    logger.warn(`${safeRoute}: ${message}`);
  }

  return res.status(statusCode).send(message);
};

function handleNoRecordsModified(res: Response, route: string, id: string, result: any): Response | void {
  if (result.affectedRows === 0) {
    return handleWarning(res, `${route}`, MESSAGES.NO_RECORDS_MODIFIED, STATUS_CODES.NOT_FOUND, id);
  }
}

const generateTokenForUnitTest = (role: string, userId: string = "test-id") =>
  // 27.6.2: Token testowy niesie też userId, żeby dało się testować własne zasoby.
  jwt.sign({ role, userId }, privateKey, { algorithm: 'RS256' });

export {
  errorHandler,
  limiter,
  limiterLogin,
  queryParameterize,
  validateEmail,
  validatePassword,
  validateUserName,
  normalizeString,
  isNonEmptyString,
  areNonEmptyStrings,
  maskEmail,
  sanitizeLogValue,
  verifyToken,
  requireSelfOrAdmin,
  requireRoles,
  handleError,
  handleWarning,
  handleNoRecordsModified,
  generateTokenForUnitTest,
};
