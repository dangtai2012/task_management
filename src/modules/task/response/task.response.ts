import { Expose, plainToInstance, Transform } from 'class-transformer';
import { TASK_STATUS_ENUM } from 'src/constants';
import { UserEntity } from 'src/dbs/entities';
import { CategoriesEntity } from 'src/dbs/entities/categories.enitity';
import { TaskEntity } from 'src/dbs/entities/tasks.entity';
import { DataPaginatedResponse, DataResponse } from 'src/system/response';

export class TaskResponseFormat {
  @Transform(({ obj }: { obj: TaskEntity }) => obj.id)
  @Expose()
  id!: string;

  @Transform(({ obj }: { obj: TaskEntity }) => obj.name)
  @Expose()
  name!: string;

  @Transform(({ obj }: { obj: TaskEntity }) => obj.slug)
  @Expose()
  slug!: string;

  @Transform(({ obj }: { obj: TaskEntity }) => obj.status)
  @Expose()
  status!: TASK_STATUS_ENUM;

  @Transform(({ obj }: { obj: TaskEntity }) =>
    obj.start_date.toLocaleDateString(),
  )
  @Expose()
  start_date!: Date;

  @Transform(({ obj }: { obj: TaskEntity }) =>
    obj.end_date.toLocaleDateString(),
  )
  @Expose()
  end_date!: Date;

  @Transform(({ obj }: { obj: TaskEntity }) =>
    obj.status_date.toLocaleDateString(),
  )
  @Expose()
  status_date!: Date;

  @Transform(({ obj }: { obj: TaskEntity }) =>
    obj.created_at.toLocaleDateString(),
  )
  @Expose()
  created_at!: Date;

  @Transform(({ obj }: { obj: TaskEntity }) => obj.creator)
  @Expose()
  creator!: UserEntity;

  @Transform(({ obj }: { obj: TaskEntity }) => obj.user_of_task)
  @Expose()
  user_of_task!: UserEntity;

  @Transform(({ obj }: { obj: TaskEntity }) => obj.category_of_task)
  @Expose()
  category_of_task!: CategoriesEntity;
}

export class ReportResponseFormat {
  @Expose()
  report_type!: string;

  @Expose()
  start_date!: string;

  @Expose()
  end_date!: string;

  @Expose()
  tasks!: TaskResponseFormat[];
}

export class TaskResponse extends DataResponse<TaskResponseFormat> {
  constructor(message: string, data?: TaskEntity) {
    super(
      message,
      plainToInstance(TaskResponseFormat, data, {
        excludeExtraneousValues: true,
      }),
      // data,
    );
  }
}

export class TaskPaginatedRespones extends DataPaginatedResponse<TaskResponseFormat> {
  constructor(
    data: TaskEntity[],
    total: number,
    page: number,
    size: number,
    message: string,
  ) {
    super(
      plainToInstance(TaskResponseFormat, data, {
        excludeExtraneousValues: true,
      }),
      total,
      page,
      size,
      message,
    );
  }
}

export class ReportResponse extends DataResponse<TaskResponseFormat[]> {
  report_type: string;

  start_date: string;

  end_date: string;

  constructor(
    message: string,
    report_type: string,
    start_date: string,
    end_date: string,
    data?: TaskEntity[],
  ) {
    super(
      message,
      plainToInstance(TaskResponseFormat, data, {
        excludeExtraneousValues: true,
      }),
    );

    this.report_type = report_type;
    this.start_date = start_date;
    this.end_date = end_date;
  }
}
