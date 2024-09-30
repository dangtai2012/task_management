import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from 'src/constants';

export const Auth = (authType: number) => SetMetadata(AUTH_TYPE_KEY, authType);
