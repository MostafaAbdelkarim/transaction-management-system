import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TRANSACTION_PACKAGE_NAME } from '@app/common';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiKeyGuard } from './guards/api-key.guard';
import { GrpcExceptionFilter } from './filters/grpc-exception.filter';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TRANSACTION_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: TRANSACTION_PACKAGE_NAME,
          protoPath: join(__dirname, '../transaction.proto'),
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [TransactionsController],
  providers: [
    ConfigService,
    TransactionsService,
    ApiKeyGuard,
    GrpcExceptionFilter,
  ],
})
export class TransactionsModule {}
