import { appConfig, AppConfig } from './app.config';
import { AuthConfig, authConfig } from './auth.config';
import { dbsConfig, DbsConfig } from './dbs.config';

export const configs = [appConfig, dbsConfig, authConfig];
export const services = [AppConfig, DbsConfig, AuthConfig];

export { appConfig, AppConfig, dbsConfig, DbsConfig, authConfig, AuthConfig };
