import { Config } from 'imap';
import dotenv from 'dotenv';
dotenv.config();

export const imapConfig: Config = {
  user: process.env.user!,
  password: process.env.pass!,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};