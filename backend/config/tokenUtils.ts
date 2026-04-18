import "dotenv/config";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import fs from "fs";

const TOKEN_EXPIRATION_TIME = "1m";
// 27.1.1: Refresh secret przestał być hardcoded i jest brany z env z bezpiecznym fallbackiem.
const SECRET_REFRESH_TOKEN =
  process.env.REFRESH_TOKEN_SECRET ||
  process.env.jwt_secret ||
  crypto.randomBytes(32).toString("hex");
const REFRESH_TOKEN_EXPIRATION = "7d";
const privateKey = fs.readFileSync("./klucze/privateKey.pem", "utf8");

interface TokenPayload {
  userId: string;
  user: string;
  role: string;
}

const generateToken = (userId: string, username: string, role: string): string => {
  // 27.1.2: Access token niesie userId, żeby backend mógł wiązać sesję z konkretnym użytkownikiem.
  const payload: TokenPayload = {
    userId,
    user: username,
    role: role,
  };
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: TOKEN_EXPIRATION_TIME,
  });
};

const generateRefreshToken = (
  userId: string,
  username: string,
  role: string,
): string => {
  // 27.1.3: Refresh token ma ten sam kontekst użytkownika co access token.
  const payload: TokenPayload = {
    userId,
    user: username,
    role: role,
  };
  return jwt.sign(payload, SECRET_REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

export {
  generateToken,
  generateRefreshToken,
  TOKEN_EXPIRATION_TIME,
  SECRET_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRATION,
};
