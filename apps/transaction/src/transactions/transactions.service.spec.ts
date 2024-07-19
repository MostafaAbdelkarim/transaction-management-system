import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionService } from './services/transaction.service';
import { Transaction, UpsertTransactionDto } from '@app/common';

const mockTransactionService = {
  upsertTransaction: jest.fn(),
  queryTransactions: jest.fn(),
};

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('upsertTransaction', () => {
    it('should upsert a transaction and return the expected result', async () => {
      const upsertTransactionDto: UpsertTransactionDto = {
        id: 'test-id',
        amount: 100,
        processorId: '5c206717-a177-4134-b52b-1d535c7078f6',
        accountId: 'account-id',
        currency: 'USD',
        messageType: '',
        transactionDetails: [],
      };

      const transactionModel: Transaction = {
        id: 'test-id',
        amount: 100,
        processorId: '5c206717-a177-4134-b52b-1d535c7078f6',
        accountId: 'account-id',
        status: 'completed',
        cardLimit: 5000,
        currency: undefined,
      };

      jest
        .spyOn(mockTransactionService, 'upsertTransaction')
        .mockResolvedValue(transactionModel);

      const result = await service.upsertTransaction(upsertTransactionDto);

      expect(result).toEqual(transactionModel);
      expect(mockTransactionService.upsertTransaction).toHaveBeenCalledWith(
        upsertTransactionDto,
        upsertTransactionDto.transactionDetails,
      );
    });

    it('should handle errors and exceptions', async () => {
      const upsertTransactionDto: UpsertTransactionDto = {
        id: 'test-id',
        amount: 100,
        processorId: '5c206717-a177-4134-b52b-1d535c7078f6',
        accountId: 'account-id',
        currency: '784',
        messageType: '',
        transactionDetails: [],
      };

      jest
        .spyOn(mockTransactionService, 'upsertTransaction')
        .mockRejectedValue(new Error('Upsert failed'));

      await expect(
        service.upsertTransaction(upsertTransactionDto),
      ).rejects.toThrow('Upsert failed');
    });
  });
});
