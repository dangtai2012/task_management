import { PartialType } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TASK_STATUS_ENUM } from 'src/constants';
import { SearchSortPaginationRequest } from 'src/system/dbs/requests/search-sort-pagination.request';

export class GetReportTaskRequest extends PartialType(
  SearchSortPaginationRequest,
) {
  @IsOptional()
  @IsString()
  keyword?: TASK_STATUS_ENUM;

  @IsString()
  reportType?: 'week' | 'month' = 'week';

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  userId: string;
}
