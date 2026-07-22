import { cleanEnv, str, num, bool } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    MONGO_DB_URI: str(),
    PORT: num(),
    LOG_DIR: str(),
    LOG_FORMAT: str(),
    ORIGIN: str(),
    CREDENTIALS: bool(),
    SECRET_KEY: str(),
    ACCESS_TOKEN_PRIVATE_KEY: str(),
    REFRESH_TOKEN_PRIVATE_KEY: str(),
    EMAIL_SERVICE: str(),
    SENDER_MAIL: str(),
    SENDER_PASSSWORD: str(),
    COMPANY_NAME: str(),
    COMPANY_ADDRESS: str(),
    COMPANY_PHONE: str(),
    COMPANY_EMAIL: str(),
    COMPANY_WEBSITE: str(),
    COMPANY_FACEBOOK: str(),
    COMPANY_INSTAGRAM: str(),
    COMPANY_LINKEDIN: str(),
    COMPANY_TWITTER: str(),
    COMPANY_YOUTUBE: str(),
    COMPANY_GITHUB: str(),
    COMPANY_LOGO: str(),
    STRIPE_PRIVATE_KEY: str(),
    STRIPE_WEBHOOK_SECRET: str(),
    AFRICAS_TALKING_USERNAME: str({ default: 'sandbox' }),
    AFRICAS_TALKING_API_KEY: str({ default: '' }),
    AFRICAS_TALKING_SHORT_CODE: str({ default: '' }),
    FRONTEND_BUILD_PATH: str({ default: '' }),
  });
};

export default validateEnv;
