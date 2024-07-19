import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
  TransactionsServiceClient,
  TRANSACTION_PACKAGE_NAME,
  Transactions,
  UpsertTransactionDto,
} from '@app/common';
import { TransactionMapper } from './mappers/transactions.mapper';
import ProcessorTwoTransactionDto from './dto/upsertProcessorTwo.dto';
import { of, throwError } from 'rxjs';
import { PaginationDto } from '@app/common';

const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
};

jest.mock('@app/common/logger/logger', () => ({
  default: () => mockLogger,
}));

describe('TransactionsService', () => {
  let service: TransactionsService;
  let clientGrpcMock: ClientGrpc;
  let transactionServiceClientMock: TransactionsServiceClient;

  beforeEach(async () => {
    transactionServiceClientMock = {
      upsertTransaction: jest.fn(),
      queryTransactions: jest.fn(),
    } as unknown as TransactionsServiceClient;

    clientGrpcMock = {
      getService: jest.fn().mockReturnValue(transactionServiceClientMock),
    } as unknown as ClientGrpc;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: TRANSACTION_PACKAGE_NAME, useValue: clientGrpcMock },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsertTransaction', () => {
    it('should handle errors from the gRPC service', (done) => {
      const processorTransactionDto = new ProcessorTwoTransactionDto();
      processorTransactionDto.id = 'some-uuid';
      const error = { details: 'Some error' };

      jest
        .spyOn(TransactionMapper, 'toUpsertTransactionDto')
        .mockReturnValue({ id: 'some-uuid' } as UpsertTransactionDto);

      jest
        .spyOn(transactionServiceClientMock, 'upsertTransaction')
        .mockReturnValue(throwError(() => error));

      service.upsertTransaction(processorTransactionDto).subscribe({
        next: () => done.fail('Expected an error, but got a result'),
        error: (err) => {
          expect(err).toBeInstanceOf(RpcException);
          done();
        },
      });
    });
  });

  describe('queryTransactions', () => {
    it('should handle errors from the gRPC service', (done) => {
      const paginationDto: PaginationDto = {
        page: 1,
        skip: 10,
        processorId: '',
      };
      const error = { details: 'Some error' };
      const transactionsResult: Transactions = {
        transactions: [
          {
            id: 'transaction-1',
            status: 'success',
            cardLimit: 50,
            accountId: '',
            processorId: '',
            amount: 50,
            currency: '',
          },
        ],
      };

      jest
        .spyOn(transactionServiceClientMock, 'queryTransactions')
        .mockReturnValue(throwError(() => error));

      service.queryTransactions(of(paginationDto)).subscribe({
        next: () => done.fail('Expected an error, but got a result'),
        error: (err) => {
          expect(err).toBeInstanceOf(RpcException);
          done();
        },
      });
    });
  });
});
