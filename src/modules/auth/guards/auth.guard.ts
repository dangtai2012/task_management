import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';
import { AUTH_TYPE_KEY, AUTH_TYPE_ENUM } from 'src/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly defaultAuthType = AUTH_TYPE_ENUM.Bearer;

  private readonly authTypeGuardMap: Record<
    AUTH_TYPE_ENUM,
    CanActivate | CanActivate[]
  > = {
    [AUTH_TYPE_ENUM.Bearer]: this.accessTokenGuard,
    [AUTH_TYPE_ENUM.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authType = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthGuard.defaultAuthType];

    /**
     * : Xử lý auth guard khi decorator @Auth chỉ cần 1 đối số duy nhất
     */

    const guard = this.authTypeGuardMap[authType];
    const canActivate = await Promise.resolve(guard.canActivate(context));

    if (!canActivate) {
      canActivate.catch((err) => {
        throw err;
      });
    }

    /**
     * : Xử lý auth guard khi decorator @Auth chuyền vào nhiều đối số
     */
    // const guards = authTypes
    //   .map((type: number) => this.authTypeGuardMap[type])
    //   .flat();

    // for (const instance of guards) {
    //   const canActivate = await Promise.resolve(
    //     instance.canActivate(context),
    //   ).catch((err) => {
    //     error: err;
    //   });

    //   if (canActivate) {
    //     return true;
    //   }
    // }

    return true;
  }
}
