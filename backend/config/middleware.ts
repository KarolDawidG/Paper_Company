import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import logger from "../logs/logger";

const middleware: Router = express.Router();

middleware.use(bodyParser.json({ limit: "200kb" }));
middleware.use(bodyParser.urlencoded({ limit: "200kb", extended: true }));

middleware.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

middleware.use(express.json());

middleware.use(express.urlencoded({ extended: true }));

middleware.use((req, res, next) => {
  const startedAt = Date.now();
  const requestPath = req.originalUrl.split("?")[0];

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const message = `${req.method} ${requestPath} -> ${res.statusCode} (${durationMs}ms)`;

    // 27.11.21: Middleware loguje tylko metodę, ścieżkę, status i czas, bez body/query, żeby nie wynosić danych wrażliwych do logów.
    if (res.statusCode >= 500) {
      logger.error(message);
      return;
    }
    if (res.statusCode >= 400) {
      logger.warn(message);
      return;
    }
    logger.info(message);
  });

  next();
});

middleware.use(
  //TODO
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'trusted-cdn.com'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "img.example.com"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "fonts.example.com"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: true,
    frameguard: { action: "deny" },
    hsts: { maxAge: 5184000 },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
    noSniff: true,
    ieNoOpen: true,
    hidePoweredBy: true,
    permittedCrossDomainPolicies: true,
  }),
);

export default middleware;
