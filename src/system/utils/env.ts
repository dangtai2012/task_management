import { ENV_ENUM } from 'src/constants';

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === ENV_ENUM.DEVELOPMENT;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === ENV_ENUM.PRODUCTION;
}
