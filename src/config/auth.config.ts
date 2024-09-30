import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';
import { AUTH_CONFIG } from 'src/constants';

export const authConfig = registerAs(AUTH_CONFIG, () => ({
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailVerifyExpires: parseInt(process.env.EMAIL_VERIFY_EXPIRES ?? '300', 10),
  secret: process.env.JWT_SECRET,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600', 10),
  refreshTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '86400', 10),
}));

@Injectable()
export class AuthConfig {
  constructor(
    @Inject(authConfig.KEY)
    protected readonly config: ConfigType<typeof authConfig>,
  ) {}

  getEmailUser(): string {
    return this.config.emailUser;
  }

  getEmailPassword(): string {
    return this.config.emailPassword;
  }

  getEmailVerifyExpires(): number {
    return this.config.emailVerifyExpires;
  }

  getSecret(): string {
    return this.config.secret;
  }

  getAudience(): string {
    return this.config.audience;
  }

  getIssuer(): string {
    return this.config.issuer;
  }

  getAccessTokenTtl(): number {
    return this.config.accessTokenTtl;
  }

  getRefreshTokenTtl(): number {
    return this.config.refreshTokenTtl;
  }
}
