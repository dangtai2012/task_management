import { Module } from '@nestjs/common';
import { ConfigModule } from './system/config';
import { modules } from './modules';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard, AuthGuard } from './modules/auth/guards';
import { RoleGuard } from './modules/auth/guards/role.guard';
import { DbsModule } from './system';

@Module({
  imports: [ConfigModule, DbsModule, ...modules],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
