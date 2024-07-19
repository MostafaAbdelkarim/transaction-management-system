import {
  Currency,
  UpsertTransactionDto,
  toNativeCurrencyEnumValue,
} from '@app/common';
import ProcessorOneTransactionDto from '../dto/upsertProcessorOne.dto';
import ProcessorTwoTransactionDto from '../dto/upsertProcessorTwo.dto';
import { toNativeMessageType } from '@app/common/utils/mappers/messageType.mapper';

export class TransactionMapper {
  static toUpsertTransactionDto(
    transaction: ProcessorOneTransactionDto | ProcessorTwoTransactionDto,
  ): UpsertTransactionDto {
    if ('mcc' in transaction) {
      const nativeMessageType = toNativeMessageType(
        transaction.message_type,
        'one',
      );
      const nativeCurrency = toNativeCurrencyEnumValue(
        transaction.billing_currency,
        'one',
      );
      const upsertTransactionDto: UpsertTransactionDto = {
        id: transaction.clearing_id
          ? transaction.parent_transaction_id
          : transaction.id,
        processorId: '5c206717-a177-4134-b52b-1d535c7078f6',
        accountId: '6d675d06-55ad-4cda-bf9a-0ecbad88fe3a',
        amount: transaction.transaction_amount,
        currency: nativeCurrency,
        messageType: nativeMessageType,
        transactionDetails: [],
      };
      return upsertTransactionDto;
    } else {
      const nativeCurrency: Currency = toNativeCurrencyEnumValue(
        transaction.transaction.details.scheme_tx_currency,
        'two',
      );
      const nativeMessageType = toNativeMessageType(transaction.type, 'two');
      const upsertTransactionDto: UpsertTransactionDto = {
        id: transaction.id,
        processorId: '5c206717-a177-4134-b52b-1d535c7078f6',
        accountId: transaction.transaction.account_id,
        amount: transaction.transaction.amount,
        currency: nativeCurrency,
        messageType: nativeMessageType,
        transactionDetails: [],
      };
      return upsertTransactionDto;
    }
  }
}
