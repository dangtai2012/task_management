import { Brackets, SelectQueryBuilder } from 'typeorm';

export function applySearch<T>(
  query: SelectQueryBuilder<T>,
  keyword: string,
  searchFields: string[],
): SelectQueryBuilder<T> {
  if (keyword && searchFields.length > 0) {
    const keywordQuery = `%${keyword}%`;

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
