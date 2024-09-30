import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from 'src/config';
import { UserEntity } from 'src/dbs/entities';
import { ICurrentUser } from '../interfaces';

@Injectable()
export class JwtProvider {
  constructor(
    /**
     * : Inject service, provider
     */

    private readonly jwtService: JwtService,
    private readonly authConfigService: AuthConfig,
  ) {}

  //#region signToken
  async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.authConfigService.getIssuer(),
        issuer: this.authConfigService.getIssuer(),
        secret: this.authConfigService.getSecret(),
        expiresIn,
      },
    );
  }
  //#endregion

  // //#region generateToken
  // async generateToken(user: UserEntity, expiresIn: number) {
  //   const token = await this.signToken(user.id, expiresIn);
  //   return token;
  // }
  // //#endregion

  //#region generateATAndRT
  async generateATAndRT(user: UserEntity) {
    const [accessToken, refreshToken] = await Promise.all([
      // Generate the access token
      this.signToken<Partial<ICurrentUser>>(
        user.id,
        this.authConfigService.getAccessTokenTtl(),
        {
          email: user.email,
          role: user.role,
        },
      ),

      // Generate the refresh token
      this.signToken(user.id, this.authConfigService.getRefreshTokenTtl()),
    ]);

    return { accessToken, refreshToken };
  }
  //#endregion

  //#region verify
  async verify(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.authConfigService.getSecret(),
      audience: this.authConfigService.getIssuer(),
      issuer: this.authConfigService.getIssuer(),
    });
    return payload;
  }
  //#endregion
}
