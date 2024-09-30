import { SetMetadata } from '@nestjs/common';
import { ROLE_ENUM, ROLE_KEY } from 'src/constants';

export const Role = (...roles: ROLE_ENUM[]) => SetMetadata(ROLE_KEY, roles);
