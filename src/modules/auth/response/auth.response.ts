import { Expose, plainToInstance, Transform } from 'class-transformer';
import { ROLE_ENUM, TASK_STATUS_ENUM } from 'src/constants';
import { UserEntity } from 'src/dbs/entities';
import { TaskEntity } from 'src/dbs/entities/tasks.entity';
import { DataPaginatedResponse, DataResponse } from 'src/system/response';

export class AuthResponseFormat {
  @Transform(({ obj }: { obj: UserEntity }) => obj.id)
  @Expose()
  id!: string;

  @Transform(({ obj }: { obj: UserEntity }) => obj.first_name)
  @Expose()
  first_name!: string;

  @Transform(({ obj }: { obj: UserEntity }) => obj.last_name)
  @Expose()
  last_name!: string;

  @Transform(({ obj }: { obj: UserEntity }) => obj.email)
  @Expose()
  email!: string;

  @Transform(({ obj }: { obj: UserEntity }) => obj.role)
  @Expose()
  role!: ROLE_ENUM;

  @Transform(({ obj }: { obj: UserEntity }) => obj.is_active)
  @Expose()
  is_active!: boolean;

  @Transform(({ obj }: { obj: UserEntity }) => obj.created_at)
  @Expose()
  created_at!: Date;
}

export class AuthResponse extends DataResponse<AuthResponseFormat> {
  constructor(message: string, data?: UserEntity) {
    super(
      message,
      plainToInstance(AuthResponseFormat, data, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
