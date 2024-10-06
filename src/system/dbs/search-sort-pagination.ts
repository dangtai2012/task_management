import { Brackets, SelectQueryBuilder } from 'typeorm';
import { Slugify } from '../utils/slugify';

export function applyFilter<T>(
  query: SelectQueryBuilder<T>,
  keyword: string,
  filterField: string,
): SelectQueryBuilder<T> {
  if (keyword && filterField) {
    query.andWhere(`${filterField} = :keyword`, { keyword });
  }

  return query;
}

export function applySearch<T>(
  query: SelectQueryBuilder<T>,
  keyword: string,
  searchFields: string[],
): SelectQueryBuilder<T> {
  if (keyword && searchFields.length > 0) {
    const keywordQuery = `%${Slugify(keyword, { lower: true, trim: true })}%`;

    query.andWhere(
      new Brackets((queryBuilder) => {
        searchFields.forEach((field) => {
          queryBuilder.orWhere(`${field} LIKE :keywordQuery`, { keywordQuery });
        });
      }),
    );
  }

  return query;
}

export function applySort<T>(
  query: SelectQueryBuilder<T>,
  sortField: string,
  sortOrder: 'ASC' | 'DESC',
): SelectQueryBuilder<T> {
  if (sortField && sortOrder) {
    query.orderBy(sortField, sortOrder);
  }

  return query;
}
export function applyPagination<T>(
  query: SelectQueryBuilder<T>,
  page: number,
  size: number,
): SelectQueryBuilder<T> {
  const skip = (page - 1) * size;
  return query.skip(skip).take(size);
}
