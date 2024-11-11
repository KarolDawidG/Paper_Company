import jwt from "jsonwebtoken";
import crypto from "crypto";
import fs from "fs";

const TOKEN_EXPIRATION_TIME = "1m";
// zmiana powoduje ze klucz zmienia sie przy kazdym restarcie serwera
// powoduje odmowe dostępu dla wszystkich zalogowanych użytkowników w poprzedniej sesji serwera
// const SECRET_REFRESH_TOKEN = crypto.randomBytes(32).toString("hex");
// w razie niepewności czy dane są bezpieczne, wystarczy zresetowac serwer, aby natychmiast uniemozliwic prace
// osobom które uzyskały nieautoryzowany dostep

const SECRET_REFRESH_TOKEN = "Jakis_super_tajny_klucz";
const REFRESH_TOKEN_EXPIRATION = "7d";
const privateKey = fs.readFileSync("./klucze/privateKey.pem", "utf8");

interface TokenPayload {
  user: string;
  role: string;
  exp?: number;
}

const generateToken = (username: string, role: string): string => {
  const payload: TokenPayload = {
    user: username,
    role: role,
    exp:
      Math.floor(Date.now() / 1000) +
      parseInt(TOKEN_EXPIRATION_TIME.split("m")[0]) * 60 * 60,
  };
  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
};

const generateRefreshToken = (username: string, role: string): string => {
  const payload: Omit<TokenPayload, "exp"> = {
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
