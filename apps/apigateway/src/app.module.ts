import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { RequestLoggerMiddleware } from './transactions/middleware/RequestLogger.middleware';

@Module({
  imports: [TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
