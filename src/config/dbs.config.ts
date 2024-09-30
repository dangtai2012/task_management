import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';
import { DBS_CONFIG } from 'src/constants/config';

export const dbsConfig = registerAs(DBS_CONFIG, () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
}));

@Injectable()
export class DbsConfig {
  constructor(
    @Inject(dbsConfig.KEY)
    protected readonly config: ConfigType<typeof dbsConfig>,
  ) {}

  getHost(): string {
    return this.config.host;
  }

  getPort(): number {
    return this.config.port;
  }

  getUsername(): string {
    return this.config.username;
  }

  getPassword(): string {
    return this.config.password;
  }

  getDatabase(): string {
    return this.config.database;
  }

  getSynchronize(): boolean {
    return this.config.synchronize;
  }

  getAutoLoadEntities(): boolean {
    return this.config.autoLoadEntities;
  }
}
