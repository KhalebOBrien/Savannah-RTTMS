import dotenv from 'dotenv';
dotenv.config();

export const loggerConfig = {
  dir: process.env.LOG_DIR || '',
  format: process.env.LOG_FORMAT || 'dev',
};
