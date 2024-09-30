import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICurrentUser } from '../interfaces';
import { CURRENT_USER } from 'src/constants';

export const CurrentUser = createParamDecorator(
  (field: keyof ICurrentUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ICurrentUser = request[CURRENT_USER];

    return field ? user?.[field] : user;
  },
);
