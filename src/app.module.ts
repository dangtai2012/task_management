import { Module } from '@nestjs/common';
import { ConfigModule } from './system/config';
import { DbsModule } from './system/dbs/dbs.module';
import { modules } from './modules';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard, AuthGuard } from './modules/auth/guards';
import { RoleGuard } from './modules/auth/guards/role.guard';

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
