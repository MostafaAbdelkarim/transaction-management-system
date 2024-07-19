import { Injectable, Logger } from '@nestjs/common';
import { TransactionModel } from '../models/transaction.model';
import { ProcessorRepository } from '../repositories/processor.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionDetailRepository } from '../repositories/transactionDetail.repository';
import getLoggerWithConfig from '@app/common/logger/logger';
import {
  NativeMessageType,
  PaginationDto,
  TransactionStatus,
  Transactions,
  UpsertTransactionDto,
} from '@app/common';
import { Observable } from 'rxjs';
import { TransactionEvents } from '../events/emitters/transaction.emitter';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
  private readonly logger: Logger = getLoggerWithConfig(
    TransactionService.name,
  );

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly processorRepository: ProcessorRepository,
    private readonly transactionDetailRepository: TransactionDetailRepository,
    private readonly transactionEmmitter: TransactionEvents,
  ) {}

  async upsertTransaction(
    transactionData: UpsertTransactionDto,
    transactionDetails: any[], // TODO: change this to type also
  ): Promise<TransactionModel> {
    // attempting to find processor by id
    const isValidProcessor = await this.processorRepository.findById(
      transactionData.processorId,
    );
    if (!isValidProcessor) {
      this.logger.error(
        `processorId[${transactionData.processorId}] | not found processor id`,
      );
      throw new RpcException({
        code: 5,
        message: `processorId[${transactionData.processorId}] | Resource not found`,
      });
    }

    // attempting to find card by id
    const card = await this.findEntityById('card', transactionData.accountId);
    if (!card) {
      this.logger.error(
        `cardId[${transactionData.accountId}] | card with given id not found`,
      );
      throw new RpcException({
        code: 5,
        message: `cardId[${transactionData.accountId}] | Resource not found`,
      });
    }

    // Attempt to find transaction with given id and processor id
    let transactionRecord =
      await this.transactionRepository.findByIdAndProcessorId(
        transactionData.id,
        transactionData.processorId,
      );

    // attempting to find account by id
    const account = await this.findEntityById(
      'account',
      transactionData.accountId,
    );
    if (!account) {
      this.logger.error(
        `accountId[${transactionData.accountId}] | account with given id not found`,
      );
      throw new RpcException({
        code: 5,
        message: `accountId[${transactionData.accountId}] | Resource not found`,
      });
    }

    const data = {
      id: transactionData.id,
      processorId: transactionData.processorId,
      accountId: transactionData.accountId,
      amount: transactionData.amount,
      currency: transactionData.currency,
      status: transactionData.messageType,
      merchantId: transactionData.accountId,
      posId: transactionData.accountId,
      cardId: transactionData.accountId,
      cardLimit: 100_000, // setting initially
    };

    // mocking transaction_details values
    const detail = { name: 'name', value: 'value' };
    const details = [];
    details.push(detail);

    // Ensuring this is Authorization transaction
    if (
      !transactionRecord &&
      transactionData.messageType === NativeMessageType.AUTHORIZATION &&
      transactionData.amount < data.cardLimit
    ) {
      data.cardLimit = 100_000 - transactionData.amount;
      data.status = TransactionStatus.PENDING;
      transactionRecord = await this.transactionRepository.create(data);
      await this.transactionDetailRepository.bulkInsertTransactionDetails(
        transactionRecord.id,
        details,
      );
      this.transactionEmmitter.emitAuthorizationEvent(transactionRecord);
    } else if (
      transactionRecord &&
      transactionRecord.status === TransactionStatus.PENDING &&
      transactionData.messageType === NativeMessageType.CLEARING
    ) {
      data.cardLimit = transactionRecord.cardLimit - transactionData.amount;
      data.status = TransactionStatus.SUCCESS;
      await this.transactionRepository.update(
        transactionData.id,
        transactionData.processorId,
        data,
      );
      await this.transactionDetailRepository.bulkInsertTransactionDetails(
        transactionRecord.id,
        details,
      );
      this.transactionEmmitter.emitClearanceEvent(transactionRecord);
    } else {
      this.logger.error(
        `transactionId[${transactionData.id}] | Invalid arguemtns provided`,
      );
      throw new RpcException({
        code: 3,
        message: `transactionId[${transactionData.id}] | Invalid arguments provided`,
      });
    }

    this.logger.log(
      `transactionId[${transactionRecord.id}] | upserted transaction with given id`,
    );

    return transactionRecord;
  }

  queryTransactions(
    paginationDto: Observable<PaginationDto>,
  ): Observable<Transactions> {
    return new Observable((observer) => {
      paginationDto.subscribe(async (pagination: PaginationDto) => {
        const { processorId, page, skip } = pagination;

        try {
          const transactions = await this.transactionRepository.findAll({
            processorId: processorId,
            page: page,
            skip: skip,
          });

          const response: Transactions = {
            transactions: transactions.map((tx) => ({
              id: tx.id,
              processorId: tx.processorId,
              accountId: tx.accountId,
              amount: tx.amount,
              status: tx.status,
              currency: tx.currency,
              cardLimit: tx.cardLimit,
            })),
          };

          observer.next(response);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      });
    });
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * mock async function call representing finding entity by id
   * @param entity
   * @param id
   * @returns Promise<boolean>
   */
  private async findEntityById(entity: string, id: string): Promise<boolean> {
    this.logger.log(
      `${entity}Id[${id}] | looking up for account with given id`,
    );
    await this.delay(25);
    return true;
  }
}
