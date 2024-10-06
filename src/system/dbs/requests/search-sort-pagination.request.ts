import { IsOptional, IsString, IsNumber, Min, IsArray } from 'class-validator';

export class SearchSortPaginationRequest {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  size?: number = 10;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchField?: string[];

  @IsOptional()
  sortField?: string;

  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
