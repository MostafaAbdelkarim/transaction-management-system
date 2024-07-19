import getLoggerWithConfig from '@app/common/logger/logger';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = getLoggerWithConfig(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent: string = req.get('user-agent') || '';

    const logFormat: string = `${method} ${originalUrl} IP: ${ip} - ${userAgent}`;
    this.logger.log(logFormat);

    next();
  }
}
