import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import {
  UpsertTransactionDto,
  PaginationDto,
  Transaction,
  Transactions,
} from '@app/common';
import { Observable, of } from 'rxjs';

const mockTransactionsService = () => ({
  upsertTransaction: jest.fn(),
  queryTransactions: jest.fn(),
});

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useFactory: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  describe('upsertTransaction', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should call TransactionsService.upsertTransaction and return a transaction', async () => {
      const upsertTransactionDto: UpsertTransactionDto = {
        id: 'some-id',
        processorId: '',
        accountId: '',
        amount: 0,
        currency: '',
        messageType: '',
        transactionDetails: [],
      };
      const result: Transaction = {
        id: 'some-id',
        processorId: '',
        accountId: '',
        amount: 0,
        status: '',
        currency: '',
        cardLimit: 0,
      };
      jest.spyOn(service, 'upsertTransaction').mockResolvedValue(result);

      expect(await controller.upsertTransaction(upsertTransactionDto)).toBe(
        result,
      );
      expect(service.upsertTransaction).toHaveBeenCalledWith(
        upsertTransactionDto,
      );
    });
  });

  describe('queryTransactions', () => {
    it('should call TransactionsService.queryTransactions and return transactions', (done) => {
      const paginationDto: PaginationDto = {
        page: 1,
        skip: 0,
        processorId: 'some-processor-id',
      };
      const result: Transactions = {
        transactions: [],
      };

      jest.spyOn(service, 'queryTransactions').mockReturnValue(of(result));

      controller.queryTransactions(of(paginationDto)).subscribe((res) => {
        expect(res).toEqual(result);
        done();
      });

      expect(service.queryTransactions).toHaveBeenCalled();
      expect(service.queryTransactions).toHaveBeenCalledWith(
        expect.any(Observable),
      );
    });
  });
});
