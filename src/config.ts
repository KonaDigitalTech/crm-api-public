// config.ts
import { config } from 'dotenv';
import { resolve } from 'path';

process.env.NODE_ENV = 'qa';

const ENV_FILE_PATH = resolve(__dirname, '..', `.env.${process.env.NODE_ENV || 'local'}`);

config({ path: ENV_FILE_PATH });