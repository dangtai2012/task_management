import { Global, Module } from '@nestjs/common';
import { ConfigModule as _ConfigModule } from '@nestjs/config';
import { configs, services } from 'src/config';
import { isProduction } from 'src/system/utils';
import envValidation from '../validation/env.validation';
import { ENV_ENUM } from 'src/constants';

@Global()
@Module({
  imports: [
    _ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isProduction() ? '.env' : `.env.${ENV_ENUM.DEVELOPMENT}`,
      load: configs,
      validationSchema: envValidation,
    }),
  ],
  providers: services,
  exports: services,
})
export class ConfigModule {}
