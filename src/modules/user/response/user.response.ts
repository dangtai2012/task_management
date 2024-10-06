import { Expose, plainToInstance, Transform } from 'class-transformer';
import { ROLE_ENUM } from 'src/constants';
import { UserEntity } from 'src/dbs/entities';
import { CategoriesEntity } from 'src/dbs/entities/categories.enitity';
import { DataPaginatedResponse, DataResponse } from 'src/system/response';

export class UserResponseFormat {
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

export class UserResponse extends DataResponse<UserResponseFormat> {
  constructor(message: string, data?: UserEntity) {
    super(
      message,
      plainToInstance(UserResponseFormat, data, {
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class UserPaginatedResponse extends DataPaginatedResponse<UserResponseFormat> {
  constructor(
    data: UserEntity[],
    total: number,
    page: number,
    size: number,
    message: string,
  ) {
    super(
      plainToInstance(UserResponseFormat, data, {
        excludeExtraneousValues: true,
      }),
      total,
      page,
      size,
      message,
    );
  }
}
