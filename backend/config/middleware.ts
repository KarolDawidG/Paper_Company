import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import URL from './url';

const middleware: Router = express.Router();

middleware.use(bodyParser.json({ limit: "200kb" }));
middleware.use(bodyParser.urlencoded({ limit: "200kb", extended: true }));

middleware.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

middleware.use(express.json());

middleware.use(express.urlencoded({ extended: true }));

middleware.use( //TODO 
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
