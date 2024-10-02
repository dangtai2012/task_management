import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class SearchSortPaginationRequest {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  size?: number = 10;

  @IsOptional()
  sortField?: string;

  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
