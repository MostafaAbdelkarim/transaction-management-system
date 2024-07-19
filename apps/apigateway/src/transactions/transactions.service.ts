import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  PaginationDto,
  TransactionsServiceClient,
  TRANSACTIONS_SERVICE_NAME,
  Transaction,
  TRANSACTION_PACKAGE_NAME,
} from '@app/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';
import { TransactionMapper } from './mappers/transactions.mapper';
import ProcessorOneTransactionDto from './dto/upsertProcessorOne.dto';
import ProcessorTwoTransactionDto from './dto/upsertProcessorTwo.dto';
import getLoggerWithConfig from '@app/common/logger/logger';

@Injectable()
export class TransactionsService implements OnModuleInit {
  private readonly logger = getLoggerWithConfig(TransactionsService.name);
  private transactionService: TransactionsServiceClient;

  constructor(@Inject(TRANSACTION_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.transactionService = this.client.getService<TransactionsServiceClient>(
      TRANSACTIONS_SERVICE_NAME,
    );
  }

  upsertTransaction(
    processorTransactionDto:
      | ProcessorOneTransactionDto
      | ProcessorTwoTransactionDto,
  ): Observable<Transaction> {
    this.logger.log(
      `transactionId[${processorTransactionDto.id}] | mapping processor one dto to upsertTransactionDto for transaction`,
    );
    const upsertTransactionDto = TransactionMapper.toUpsertTransactionDto(
      processorTransactionDto,
    );
    this.logger.log(
      `transactionId[${upsertTransactionDto.id}] | mapped and sending to rpc service`,
    );
    return this.transactionService.upsertTransaction(upsertTransactionDto).pipe(
      catchError((error) => {
        this.logger.error(
          `transactionId[${upsertTransactionDto.id}] | ${error.details}`,
        );
        return throwError(() => new RpcException(error));
      }),
    );
  }

  queryTransactions(paginationDto: Observable<PaginationDto>) {
    return this.transactionService.queryTransactions(paginationDto).pipe(
      catchError((error) => {
        this.logger.error(`${error.details} | Listing transactions paginated`);
        return throwError(() => new RpcException(error));
      }),
    );
  }
}
