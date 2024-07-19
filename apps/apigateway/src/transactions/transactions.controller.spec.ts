import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PaginationDto } from '@app/common';
import ProcessorOneTransactionDto from './dto/upsertProcessorOne.dto';
import ProcessorTwoTransactionDto from './dto/upsertProcessorTwo.dto';
import { of } from 'rxjs';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  BadRequestException,
  INestApplication,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;
  let app: INestApplication;

  const mockTransactionsService = {
    upsertTransaction: jest.fn().mockImplementation((dto) => of(dto)),
    queryTransactions: jest.fn().mockImplementation((dto) => of([dto])),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'PROCESSOR_ONE_API_KEY') return 'mock-processor-one-api-key';
      if (key === 'PROCESSOR_TWO_API_KEY') return 'mock-processor-two-api-key';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        ApiKeyGuard,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        Reflector,
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
          }),
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('firstProcessorWebhook', () => {
    it('should call upsertTransaction with the correct DTO', () => {
      const dto = new ProcessorOneTransactionDto();
      controller.firstProcessorWebhook(dto);
      expect(service.upsertTransaction).toHaveBeenCalledWith(dto);
    });

    it('should throw validation error if id is boolean', () => {
      const dto = { id: true } as any;
      try {
        controller.firstProcessorWebhook(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse().message).toContain('id must be a UUID');
      }
    });
  });

  describe('secondProcessorWebhook', () => {
    it('should call upsertTransaction with the correct DTO', () => {
      const dto = new ProcessorTwoTransactionDto();
      controller.secondProcessorWebhook(dto);
      expect(service.upsertTransaction).toHaveBeenCalledWith(dto);
    });

    it('should throw validation error if id is boolean', () => {
      const dto = { id: true } as any;
      try {
        controller.secondProcessorWebhook(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse().message).toContain('id must be a UUID');
      }
    });
  });

  describe('queryTransactionsPaginated', () => {
    it('should call queryTransactions with the correct pagination DTO', () => {
      const paginationDto: PaginationDto = {
        processorId: '1',
        page: 1,
        skip: 0,
      };
      controller.queryTransactionsPaginated(paginationDto);
      expect(service.queryTransactions).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });
  });
});
