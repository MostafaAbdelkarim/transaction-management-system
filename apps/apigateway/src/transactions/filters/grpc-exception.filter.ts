import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Catch(RpcException)
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const error = exception.getError() as { code: status; details: string };

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (error.code) {
      case status.NOT_FOUND:
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Resource not found';
        break;
      case status.INVALID_ARGUMENT:
        statusCode = HttpStatus.BAD_REQUEST;
        message = error.details;
        break;
      case status.PERMISSION_DENIED:
        statusCode = HttpStatus.FORBIDDEN;
        message = 'Permission denied';
        break;
      default:
        message = error.details || message;
        break;
    }

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
