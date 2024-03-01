const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const URL = require("./url");

const middleware = express.Router();

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

middleware.use(express.json({ extended: true }));

middleware.use(express.urlencoded({ extended: true }));

middleware.use(
  helmet({
    contentSecurityPolicy: {
      // Włączenie domyślnej polityki CSP
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'trusted-cdn.com'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "img.example.com"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "font.example.com"],
      },
    },
    crossOriginEmbedderPolicy: true, // Włączenie polityki COEP
    crossOriginOpenerPolicy: true, // Włączenie polityki COOP
    crossOriginResourcePolicy: true, // Włączenie polityki CORP
    dnsPrefetchControl: true, // Włączenie kontroli nad DNS prefetching
    frameguard: { action: "deny" }, // Opcje zabezpieczenia przed atakami clickjacking
    hsts: { maxAge: 5184000 }, // Konfiguracja Strict Transport Security (HSTS)
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Konfiguracja polityki referer
    xssFilter: true, // Włączenie filtra XSS
    noSniff: true, // Zapobieganie sniffingowi MIME
    ieNoOpen: true, // Blokada otwierania w IE poprzez nagłówek "X-Download-Options"
    hidePoweredBy: true, // Ukrycie informacji o serwerze
    permittedCrossDomainPolicies: true, // Opcje zezwolenia na polityki zdalnego dostępu
    featurePolicy: {
      features: {
        accelerometer: ["'none'"], // Ograniczenie dostępu do akcelerometru
        camera: ["'none'"], // Ograniczenie dostępu do kamery
        geolocation: ["'none'"], // Ograniczenie dostępu do geolokalizacji
        microphone: ["'none'"], // Ograniczenie dostępu do mikrofonu
      },
    },
  }),
);

module.exports = middleware;
