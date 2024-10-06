import { DataResponse } from './data.response';

// interface IMeta {
//   itemsPerPage: number;
//   totalItems: number;
//   currentPage: number;
//   totalPages: number;
// }

export class PaginateMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;

  constructor(
    itemsPerPage: number,
    totalItems: number,
    currentPage: number,
    totalPages: number,
  ) {
    this.itemsPerPage = itemsPerPage;
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
  }
}

export class DataPaginatedResponse<T> extends DataResponse<T[]> {
  meta: PaginateMeta;

  constructor(
    data: T[],
    total: number,
    page: number,
    size: number,
    message: string = '',
  ) {
    super(message, data);
    this.meta = new PaginateMeta(
      (size = data.length !== 0 ? size : 0),
      total,
      page,
      size !== 0 ? Math.ceil(total / size) : 1,
    );
  }
}
