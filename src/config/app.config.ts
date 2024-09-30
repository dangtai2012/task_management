import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';
import { APP_CONFIG } from 'src/constants/config';

export const appConfig = registerAs(APP_CONFIG, () => ({
  host: process.env.APP_HOST ?? 'localhost',
  port: Number(process.env.APP_PORT) ?? 3000,
  api_document: process.env.APP_API_DOCUMENT === 'true',
}));

@Injectable()
export class AppConfig {
  constructor(
    @Inject(appConfig.KEY)
    protected readonly config: ConfigType<typeof appConfig>,
  ) {}

  getHost(): string {
    return this.config.host;
  }

  getPort(): number {
    return this.config.port;
  }

  getApiDocument(): boolean {
    return this.config.api_document;
  }
}
