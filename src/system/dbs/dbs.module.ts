import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DbsConfig } from 'src/config';
import { join } from 'path';
import {
  PasswordResetEntity,
  SessionEntity,
  UserEntity,
} from 'src/dbs/entities';
import { CategoriesEntity } from 'src/dbs/entities/categories.enitity';
import { TaskEntity } from 'src/dbs/entities/tasks.entity';

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

    TypeOrmModule.forFeature([
      UserEntity,
      SessionEntity,
      PasswordResetEntity,
      CategoriesEntity,
      TaskEntity,
    ]),
  ],

  exports: [TypeOrmModule],
})
export class DbsModule {}
