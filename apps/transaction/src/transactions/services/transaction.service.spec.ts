import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from '../repositories/transaction.repository';
import { ProcessorRepository } from '../repositories/processor.repository';
import { TransactionDetailRepository } from '../repositories/transactionDetail.repository';
import { TransactionEvents } from '../events/emitters/transaction.emitter';
import { RpcException } from '@nestjs/microservices';
import {
  UpsertTransactionDto,
  NativeMessageType,
  TransactionStatus,
  PaginationDto,
  Transactions,
} from '@app/common';
import { of } from 'rxjs';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: TransactionRepository;
  let processorRepository: ProcessorRepository;
  let transactionDetailRepository: TransactionDetailRepository;
  let transactionEvents: TransactionEvents;

  const mockTransactionRepository = {
    findByIdAndProcessorId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
  };

  const mockProcessorRepository = {
    findById: jest.fn(),
  };

  const mockTransactionDetailRepository = {
    bulkInsertTransactionDetails: jest.fn(),
  };

  const mockTransactionEvents = {
    emitAuthorizationEvent: jest.fn(),
    emitClearanceEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: TransactionRepository, useValue: mockTransactionRepository },
        { provide: ProcessorRepository, useValue: mockProcessorRepository },
        {
          provide: TransactionDetailRepository,
          useValue: mockTransactionDetailRepository,
        },
        { provide: TransactionEvents, useValue: mockTransactionEvents },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    processorRepository = module.get<ProcessorRepository>(ProcessorRepository);
    transactionDetailRepository = module.get<TransactionDetailRepository>(
      TransactionDetailRepository,
    );
    transactionEvents = module.get<TransactionEvents>(TransactionEvents);
  });

  describe('upsertTransaction', () => {
    it('should successfully upsert a transaction', async () => {
      const upsertTransactionDto: UpsertTransactionDto = {
        id: 'transaction-id',
        processorId: 'processor-id',
        accountId: 'account-id',
        amount: 1000,
        currency: 'USD',
        messageType: NativeMessageType.AUTHORIZATION,
        transactionDetails: [],
      };

      const mockTransaction = {
        id: 'transaction-id',
        processorId: 'processor-id',
        accountId: 'account-id',
        amount: 1000,
        currency: 'USD',
        status: TransactionStatus.PENDING,
        cardLimit: 99000,
        merchantId: 'account-id',
        posId: 'account-id',
        cardId: 'account-id',
      };

      mockProcessorRepository.findById.mockResolvedValue(true);
      mockTransactionRepository.findByIdAndProcessorId.mockResolvedValue(null);
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);
      mockTransactionDetailRepository.bulkInsertTransactionDetails.mockResolvedValue(
        undefined,
      );

      const result = await service.upsertTransaction(upsertTransactionDto, [
        { name: 'name', value: 'value' },
      ]);
      expect(result).toEqual(mockTransaction);

      expect(transactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'transaction-id',
          processorId: 'processor-id',
          amount: 1000,
          currency: 'USD',
          status: TransactionStatus.PENDING,
          cardLimit: 99000,
          merchantId: 'account-id',
          posId: 'account-id',
          cardId: 'account-id',
        }),
      );
      expect(transactionEvents.emitAuthorizationEvent).toHaveBeenCalledWith(
        mockTransaction,
      );
    });

    it('should throw RpcException if processor is not found', async () => {
      const upsertTransactionDto: UpsertTransactionDto = {
        id: 'transaction-id',
        processorId: 'invalid-processor-id',
        accountId: 'account-id',
        amount: 1000,
        currency: 'USD',
        messageType: NativeMessageType.AUTHORIZATION,
        transactionDetails: [],
      };

      mockProcessorRepository.findById.mockResolvedValue(null);

      await expect(
        service.upsertTransaction(upsertTransactionDto, []),
      ).rejects.toThrowError(
        new RpcException({
          code: 5,
          message: 'processorId[invalid-processor-id] | Resource not found',
        }),
      );
    });
  });

  describe('queryTransactions', () => {
    it('should successfully query transactions', async () => {
      const paginationDto: PaginationDto = {
        processorId: 'processor-id',
        page: 1,
        skip: 0,
      };

      const mockTransactions = [
        {
          id: 'transaction-id',
          processorId: 'processor-id',
          accountId: 'account-id',
          amount: 1000,
          currency: 'USD',
          status: TransactionStatus.PENDING,
          cardLimit: 99000,
          merchantId: 'account-id',
          posId: 'account-id',
          cardId: 'account-id',
        },
      ];

      mockTransactionRepository.findAll.mockResolvedValue(mockTransactions);

      const result = await new Promise<Transactions>((resolve, reject) => {
        service.queryTransactions(of(paginationDto)).subscribe({
          next: (response) => resolve(response),
          error: (err) => reject(err),
        });
      });

      expect(result).toEqual({
        transactions: mockTransactions.map((tx) => ({
          id: tx.id,
          processorId: tx.processorId,
          accountId: tx.accountId,
          amount: tx.amount,
          status: tx.status,
          currency: tx.currency,
          cardLimit: tx.cardLimit,
        })),
      });
      expect(transactionRepository.findAll).toHaveBeenCalledWith({
        processorId: 'processor-id',
        page: 1,
        skip: 0,
      });
    });
  });
});
