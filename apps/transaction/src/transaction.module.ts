import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { LoggerInterceptor } from './interceptors/InterceptorLogger.interceptor';

@Module({
  imports: [
    TransactionsModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [LoggerInterceptor],
})
export class TransactionModule {}
