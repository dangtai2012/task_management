import { DataResponse } from './data.response';

interface IMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

interface ILinks {
  first: string;
  last: string;
  current: string;
  next: string | null;
  previous: string | null;
}

export class DataPaginatedResponse<T> extends DataResponse<T[]> {
  meta: IMeta;
  links: ILinks;

  constructor(
    data: T[],
    meta: IMeta,
    links: ILinks,
    message: string = '',
    status: string = 'success',
  ) {
    super(data, message, status);
    this.meta = meta;
    this.links = links;
  }
}
