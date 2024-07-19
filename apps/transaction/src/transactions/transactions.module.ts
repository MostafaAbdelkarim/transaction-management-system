import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcessorModel } from './models/processor.model';
import { TransactionModel } from './models/transaction.model';
import { TransactionDetailModel } from './models/transaction-details.model';
import { TransactionService } from './services/transaction.service';
import { ProcessorRepository } from './repositories/processor.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionDetailRepository } from './repositories/transactionDetail.repository';
import { TransactionEvents } from './events/emitters/transaction.emitter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TransactionListeners } from './events/listeners/transaction.listerner';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    SequelizeModule.forFeature([
      ProcessorModel,
      TransactionModel,
      TransactionDetailModel,
    ]),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionEvents,
    TransactionListeners,
    ProcessorRepository,
    TransactionRepository,
    TransactionService,
    TransactionDetailRepository,
    TransactionsService,
  ],
})
export class TransactionsModule {}
