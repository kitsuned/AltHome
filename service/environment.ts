import { join } from 'path';
import process from 'process';

// eslint-disable-next-line
export const APP_ID = process.env.APP_ID;
// eslint-disable-next-line
export const SERVICE_ID = process.env.SERVICE_ID;
export const SERVICE_ROOT_DIR = process.cwd();
export const APP_ROOT_DIR = join(SERVICE_ROOT_DIR, `../../applications/${APP_ID}`);
