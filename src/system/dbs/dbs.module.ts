import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DbsConfig } from 'src/config';
import { join } from 'path';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [DbsConfig],
      useFactory: (dbsConfig: DbsConfig) => ({
        type: 'postgres',
        host: dbsConfig.getHost(),
        port: dbsConfig.getPort(),
        username: dbsConfig.getUsername(),
        password: dbsConfig.getPassword(),
        database: dbsConfig.getDatabase(),
        synchronize: dbsConfig.getSynchronize(),
        autoLoadEntities: dbsConfig.getAutoLoadEntities(),
        entities: [join(__dirname, '../../dbs/entities/**/*.entity{.ts,.js}')],
      }),
    }),
  ],
})
export class DbsModule {}
