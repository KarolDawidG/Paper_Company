import winston from "winston";
const { createLogger, transports, format } = winston;
const { combine, timestamp, printf, errors, splat } = format;

const logLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack ?? message}`;
});

const logger = createLogger({
  level: logLevel,
  // 27.11.1: Logger zbiera teraz także stack trace i pełne logi aplikacyjne, żeby wyeliminować rozproszone console.* w backendzie.
  format: combine(
    errors({ stack: true }),
    splat(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/combined.log" }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
  // 27.11.19: Winston przechwytuje też wyjątki procesu, żeby uncaughtException nie ginęło poza standardowym flow requestów.
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: "logs/exceptions.log" }),
  ],
  // 27.11.20: Odrzucone promise'y są logowane osobno, żeby łatwiej wyłapać unhandledRejection w async backendu.
  rejectionHandlers: [
    new transports.Console(),
    new transports.File({ filename: "logs/rejections.log" }),
  ],
  exitOnError: false,
});

export default logger;
