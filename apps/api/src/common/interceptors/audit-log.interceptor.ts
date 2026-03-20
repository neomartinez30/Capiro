import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditLog');
  private readonly mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    if (!this.mutatingMethods.includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        this.logger.log({
          action: `${method} ${url}`,
          userId: user?.sub,
          tenantId: user?.tenantId,
          ip: request.ip,
          timestamp: new Date().toISOString(),
        });
      }),
    );
  }
}
