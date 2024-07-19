import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TransactionListeners {
  @OnEvent('transaction.authorization')
  handleAuthorizationEvent(transaction) {
    console.log('Authorization event handled:', transaction);
  }

  @OnEvent('transaction.clearance')
  handleClearanceEvent(transaction) {
    console.log('Clearance event handled:', transaction);
  }
}
