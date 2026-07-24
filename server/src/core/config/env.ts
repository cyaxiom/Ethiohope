import { config } from 'dotenv';
import path from 'path';

// Determine environment name
const env = process.env.NODE_ENV || 'development';

// Load appropriate .env file based on environment
const envFile = path.resolve(process.cwd(), `.env.${env}`);
config({ path: envFile });
// console.log(envFile);

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const {
  NODE_ENV,
  PORT,
  MONGO_DB_URI,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  EXCHANGE_BASE_URL,
  ACCESS_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
  CLIENT_URL,
  COMPANY_LOGO,
  COMPANY_NAME,
  COMPANY_ADDRESS,
  COMPANY_PHONE,
  COMPANY_EMAIL,
  COMPANY_WEBSITE,
  COMPANY_FACEBOOK,
  COMPANY_TWITTER,
  COMPANY_INSTAGRAM,
  COMPANY_YOUTUBE,
  COMPANY_LINKEDIN,
  COMPANY_GITHUB,
  COMPANY_GOOGLE_PLAY,
  COMPANY_APP_STORE,
  EMAIL_SERVICE,
  SENDER_MAIL,
  SENDER_PASSSWORD,
  STRIPE_PRIVATE_KEY,
  STRIPE_WEBHOOK_SECRET,
  AFRICAS_TALKING_USERNAME,
  AFRICAS_TALKING_API_KEY,
  AFRICAS_TALKING_SHORT_CODE,
  FRONTEND_BUILD_PATH,
  GA_PROPERTY_ID,
} = process.env;
