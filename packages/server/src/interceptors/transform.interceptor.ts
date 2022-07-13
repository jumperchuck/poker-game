import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Response, Result } from '../constants/result';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(_: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    return next.handle().pipe(
      catchError((err) => throwError(new BadGatewayException(Result.FAIL.build(err)))),
      map((data) =>
        typeof data === 'boolean' && !data
          ? Result.FAIL.build(data)
          : Result.SUCCESS.build(data),
      ),
    );
  }
}
