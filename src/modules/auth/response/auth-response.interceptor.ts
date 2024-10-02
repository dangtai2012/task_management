import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { DataResponse } from 'src/system/response';
import { DataPaginatedResponse } from 'src/system/response/data-paginated.response';

@Injectable()
export class AuthResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const { page, limit } = request.query;

    return next.handle().pipe(
      map(({ message, data }) => {
        // if (page && limit) {
        //   const baseURL = request.protocol + '://' + request.headers.host + '/';
        //   const newURL = new URL(request.url, baseURL);
        //   const totalItems = data.length;
        //   const totalPages = Math.ceil(totalItems / limit);
        //   const nextPage = page === totalPages ? page : page + 1;
        //   const previousPage = page === 1 ? page : page - 1;

        //   const meta = {
        //     itemsPerPage: limit,
        //     totalItems: totalItems,
        //     currentPage: page,
        //     totalPages: totalPages,
        //   };

        //   const links = {
        //     first: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=1`,
        //     last: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${totalPages}`,
        //     current: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${page}`,
        //     next: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${nextPage}`,
        //     previous: `${newURL.origin}${newURL.pathname}?limit=${limit}&page=${previousPage}`,
        //   };

        //   return new DataPaginatedResponse(data, meta, links, message);
        // }

        return new DataResponse<T>(data, message);
      }),
    );
  }
}
