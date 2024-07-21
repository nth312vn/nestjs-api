import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileCountInterceptor implements NestInterceptor {
  constructor(private readonly expectedCount: number) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (
      !request.files ||
      Object.keys(request.files).length !== this.expectedCount
    ) {
      throw new BadRequestException('Exactly one file must be uploaded');
    }

    return next.handle();
  }
}

export function FileCount(expectedCount: number): Type<NestInterceptor> {
  @Injectable()
  class Interceptor extends FileCountInterceptor {
    constructor() {
      super(expectedCount);
    }
  }
  return Interceptor;
}
