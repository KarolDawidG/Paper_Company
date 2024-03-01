import dotenv from 'dotenv';
dotenv.config();

interface Config {
  hostDB: string | undefined;
  nameDB: string | undefined;
  userDB: string | undefined;
  passDB: string | undefined;
  pass: string | undefined;
  user: string | undefined;
  service: string | undefined;
  JWT_CONFIRMED_TOKEN: string | undefined;
  REACT_APP_SECRET_KEY: string | undefined;
  jwt_secret: string | undefined;
}

const config: Config = {
  hostDB: process.env.HOST_DB,
  nameDB: process.env.NAME_DB,
  userDB: process.env.USER_DB,
  passDB: process.env.PASS_DB,
  pass: process.env.pass,
  user: process.env.user,
  service: process.env.service,
  JWT_CONFIRMED_TOKEN: process.env.JWT_CONFIRMED_TOKEN,
  REACT_APP_SECRET_KEY: process.env.REACT_APP_SECRET_KEY,
  jwt_secret: process.env.jwt_secret,
};

export default config;