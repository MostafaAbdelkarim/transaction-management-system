import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { API_KEY_ENV } from '../decorators/api-key-env.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'];
    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    const envVar = this.reflector.get<string>(
      API_KEY_ENV,
      context.getHandler(),
    );

    if (!envVar) {
      throw new UnauthorizedException(
        'API key environment variable is not defined',
      );
    }

    const expectedApiKey = this.configService.get<string>(envVar);

    if (apiKey !== expectedApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return apiKey === expectedApiKey;
  }
}
