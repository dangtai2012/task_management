import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtProvider } from '../services/jwt.provider';
import { CURRENT_SESSION, CURRENT_USER } from 'src/constants';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    /**
     * : Inject service, provider
     */

    //: Provider
    private readonly jwtProvider: JwtProvider,

    //: Service
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request from the execution context
    const request = context.switchToHttp().getRequest();
    // Extract the token from header
    const token = this.extractRequestFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('User not sign in');
    }

    try {
      const session = await this.authService.getSessionByToken(token);

      if (!session || !!session.logout_at) {
        throw new UnauthorizedException('Please sign in first');
      }

      const payload = await this.jwtProvider.verify(token);

      request[CURRENT_USER] = payload;
      request[CURRENT_SESSION] = session;
    } catch (error) {
      throw error;
    }

    // Extract the token
    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
