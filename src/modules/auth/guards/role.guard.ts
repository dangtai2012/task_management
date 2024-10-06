import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CURRENT_USER, ROLE_KEY } from 'src/constants';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request[CURRENT_USER];

    if (user && user.role) {
      const hasRequiredRole = roles.some((role: string) => user.role === role);
      if (!hasRequiredRole) {
        throw new ForbiddenException(
          'You do not have permission (Roles) to access this resource',
        );
      }
    }

    return true;
  }
}
