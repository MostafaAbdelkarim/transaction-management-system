import { Controller } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  UpsertTransactionDto,
  TransactionsServiceController,
  TransactionsServiceControllerMethods,
  PaginationDto,
  Transaction,
  Transactions,
} from '@app/common';
import { Observable } from 'rxjs';
import getLoggerWithConfig from '@app/common/logger/logger';

@Controller()
@TransactionsServiceControllerMethods()
export class TransactionsController implements TransactionsServiceController {
  private readonly logger = getLoggerWithConfig(TransactionsController.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  async upsertTransaction(
    upsertTransaction: UpsertTransactionDto,
  ): Promise<Transaction | Observable<Transaction>> {
    this.logger.log(
      `transactionId[${upsertTransaction.id}] | recieved from rest service, processing...`,
    );
    return await this.transactionsService.upsertTransaction(upsertTransaction);
  }

  queryTransactions(
    paginationDto: Observable<PaginationDto>,
  ): Observable<Transactions> {
    paginationDto.subscribe({
      next: (data: PaginationDto) => {
        this.logger.log(
          `processorId[${data.processorId ? data.processorId : 'all'}] page[${data.page}] skip[${data.skip}] | Listing transactions for given processor id`,
        );
      },
    });
    return this.transactionsService.queryTransactions(paginationDto);
  }
}
