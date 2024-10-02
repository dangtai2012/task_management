import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserResponseInterceptor } from './response/user-response.interceptor';

@Module({
  controllers: [UserController],
  providers: [UserService],

  exports: [UserService],
})
export class UserModule {}
