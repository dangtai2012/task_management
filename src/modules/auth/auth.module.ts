import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { authConfig } from 'src/config';
import { MailProvider } from './services/mail.provider';
import { ConfigModule } from 'src/system/config';
import { JwtProvider } from './services/jwt.provider';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthResponseInterceptor } from './response/auth-response.interceptor';

@Module({
  imports: [JwtModule.registerAsync(authConfig.asProvider()), ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, JwtProvider, MailProvider],
  exports: [AuthService, JwtProvider, MailProvider],
})
export class AuthModule {}
