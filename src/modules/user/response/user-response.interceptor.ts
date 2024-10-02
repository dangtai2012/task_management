import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { DataPaginatedResponse, DataResponse } from 'src/system/response';

@Injectable()
export class UserResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const page = request.query.page ? Number(request.query.page) : null;
    const size = request.query.size ? Number(request.query.size) : null;

    return next.handle().pipe(
      map(({ message, data }) => {
        if (page && size) {
          const baseURL = request.protocol + '://' + request.headers.host + '/';
          const newURL = new URL(request.url, baseURL);
          const totalItems = data.total;
          const totalPages = Math.ceil(data.total / size);
          const nextPage = page === totalPages ? page : page + 1;
          const previousPage = page === 1 ? page : page - 1;

          const meta = {
            itemsPerPage: size,
            totalItems,
            currentPage: page,
            totalPages,
          };

          const links = {
            first: `${newURL.origin}${newURL.pathname}?size=${size}&page=1`,
            last: `${newURL.origin}${newURL.pathname}?size=${size}&page=${totalPages}`,
            current: `${newURL.origin}${newURL.pathname}?size=${size}&page=${page}`,
            next: `${newURL.origin}${newURL.pathname}?size=${size}&page=${nextPage}`,
            previous: `${newURL.origin}${newURL.pathname}?size=${size}&page=${previousPage}`,
          };

          return new DataPaginatedResponse(data.user, meta, links, message);
        }

        return new DataResponse<T>(data.user, message);
      }),
    );
  }
}
