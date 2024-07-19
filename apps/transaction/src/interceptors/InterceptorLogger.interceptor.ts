import getLoggerWithConfig from '@app/common/logger/logger';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = getLoggerWithConfig(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToRpc().getContext();
    const method = context.getHandler().name;

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`[${method}] Request handled in ${Date.now() - now}ms`);
      }),
    );
  }
}
