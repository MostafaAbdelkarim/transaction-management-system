import { Injectable } from '@nestjs/common';
import {
  Transaction,
  UpsertTransactionDto,
  PaginationDto,
  Transactions,
  fromNativeCurrencyEnumValue,
} from '@app/common';
import { Observable } from 'rxjs';
import { TransactionService } from './services/transaction.service';
import getLoggerWithConfig from '@app/common/logger/logger';

@Injectable()
export class TransactionsService {
  private readonly logger = getLoggerWithConfig(TransactionsService.name);

  constructor(private readonly transactionService: TransactionService) {}

  async upsertTransaction(
    upsertTransactionDto: UpsertTransactionDto,
  ): Promise<Transaction | Observable<Transaction>> {
    this.logger.log(
      `transactionId[${upsertTransactionDto.id}] | recieved from grpc controller to service, upserting...`,
    );
    const transactionModel = await this.transactionService.upsertTransaction(
      upsertTransactionDto,
      upsertTransactionDto.transactionDetails,
    );

    this.logger.log(
      `transactionId[${transactionModel.id}] | upserted and converting to grpc response.`,
    );

    let processorCurrency: string;

    if (
      transactionModel.processorId === '5c206717-a177-4134-b52b-1d535c7078f6'
    ) {
      processorCurrency = fromNativeCurrencyEnumValue(
        transactionModel.currency,
        'two',
      );
    } else {
      processorCurrency = fromNativeCurrencyEnumValue(
        transactionModel.currency,
        'one',
      );
    }

    const transaction: Transaction = {
      id: transactionModel.id,
      amount: transactionModel.amount,
      processorId: transactionModel.processorId,
      accountId: transactionModel.accountId,
      status: transactionModel.status,
      currency: processorCurrency,
      cardLimit: transactionModel.cardLimit,
    };

    return transaction;
  }

  queryTransactions(
    paginationDto: Observable<PaginationDto>,
  ): Observable<Transactions> {
    return this.transactionService.queryTransactions(paginationDto);
  }
}
