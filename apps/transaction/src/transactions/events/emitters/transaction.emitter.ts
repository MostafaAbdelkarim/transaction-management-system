// transaction.events.ts
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class TransactionEvents {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitAuthorizationEvent(transaction) {
    this.eventEmitter.emit('transaction.authorization', transaction);
  }

  emitClearanceEvent(transaction) {
    this.eventEmitter.emit('transaction.clearance', transaction);
  }
}
