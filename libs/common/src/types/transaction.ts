/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'transaction';

export interface PaginationDto {
  processorId: string;
  page: number;
  skip: number;
}

export interface Transactions {
  transactions: Transaction[];
}

export interface UpsertTransactionDto {
  id: string;
  processorId: string;
  accountId: string;
  amount: number;
  currency: string;
  messageType: string;
  transactionDetails: TransactionDetails[] | undefined;
}

export interface Transaction {
  id: string;
  processorId: string;
  accountId: string;
  amount: number;
  status: string;
  currency: string;
  cardLimit: number;
  transactionDetails?: TransactionDetails[] | undefined;
}

export interface TransactionDetails {
  id: string;
  transactionId: string;
  name: string;
  value: string;
}

export const TRANSACTION_PACKAGE_NAME = 'transaction';

export interface TransactionsServiceClient {
  upsertTransaction(request: UpsertTransactionDto): Observable<Transaction>;

  queryTransactions(
    request: Observable<PaginationDto>,
  ): Observable<Transactions>;
}

export interface TransactionsServiceController {
  upsertTransaction(
    request: UpsertTransactionDto,
  ): Promise<Transaction | Observable<Transaction>>;

  queryTransactions(
    request: Observable<PaginationDto>,
  ): Observable<Transactions>;
}

export function TransactionsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['upsertTransaction'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('TransactionsService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = ['queryTransactions'];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('TransactionsService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const TRANSACTIONS_SERVICE_NAME = 'TransactionsService';
