import { config } from "dotenv";
config();
export const ND_PORT = process.env.PORT_ND || 3000;
export const DB_PORT = process.env.PORT_DB || 5432;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWD = process.env.DB_PASSWD || "";
export const DB_DATABASE = process.env.DB_DATABASE || "yourtree";

export const BACKBLAZE_KEY_ID = process.env.BACKBLAZE_KEY_ID;
export const BACKBLAZE_KEY_NAME = process.env.BACKBLAZE_KEY_NAME;
export const BACKBLAZE_APP_KEY = process.env.BACKBLAZE_APP_KEY;

export const BACKBLAZE_REGION = process.env.BACKBLAZE_REGION;
export const BACKBLAZE_ENDPOINT = process.env.BACKBLAZE_ENDPOINT;
export const BACKBLAZE_BUCKET = process.env.BACKBLAZE_BUCKET;

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const BREVO_PASSWD_SMTP = process.env.BREVO_PASSWD_SMTP;
export const BREVO_HOST = process.env.BREVO_HOST;
export const BREVO_PORT = process.env.BREVO_PORT;
export const BREVO_USER = process.env.BREVO_USER;
