import dotenv from 'dotenv';
import { cleanEnv, num, port, str, url, host, email } from 'envalid';

dotenv.config();

export const ENV_CONFIG = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'production', 'staging'],
    default: 'development',
  }),
  HOST: host({ default: 'http://localhost' }),
  PORT: port({ default: 3000 }),
});
