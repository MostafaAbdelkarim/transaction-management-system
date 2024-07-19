import { SetMetadata } from '@nestjs/common';

export const API_KEY_ENV = 'API_KEY_ENV';

export const ApiKeyEnv = (envVar: string) => SetMetadata(API_KEY_ENV, envVar);
