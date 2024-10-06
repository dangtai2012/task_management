import { Expose, plainToInstance, Transform } from 'class-transformer';
import { UserEntity } from 'src/dbs/entities';
import { CategoriesEntity } from 'src/dbs/entities/categories.enitity';
import { TaskEntity } from 'src/dbs/entities/tasks.entity';
import { DataPaginatedResponse, DataResponse } from 'src/system/response';

// export class CategoryResponseFormat {
//   @Transform(({ obj }: { obj: CategoriesEntity }) => obj.id)
//   @Expose()
//   id!: string;

//   @Transform(({ obj }: { obj: CategoriesEntity }) => obj.name)
//   @Expose()
//   name!: string;

//   @Transform(({ obj }: { obj: CategoriesEntity }) => obj.slug)
//   @Expose()
//   slug!: string;

//   @Transform(({ obj }: { obj: UserEntity }) => obj.id)
//   @Expose()
//   user_id!: string;

//   @Transform(({ obj }: { obj: CategoriesEntity }) => obj.user_id)
//   @Expose()
//   tasks!: TaskEntity[];
// }

export class CategoryResponse extends DataResponse<CategoriesEntity> {
  constructor(message: string, data?: CategoriesEntity) {
    super(message, data);
  }
}

export class CategoryPaginatedResponse extends DataPaginatedResponse<CategoriesEntity> {
  constructor(
    data: CategoriesEntity[],
    total: number,
    page: number,
    size: number,
    message: string,
  ) {
    super(data, total, page, size, message);
  }
}
