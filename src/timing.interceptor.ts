import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const started = Date.now();

    return next.handle().pipe(
      map(data => {
        console.log(`:Req took ${Date.now() - started}ms`)

        return data
      })
    )
  }
}