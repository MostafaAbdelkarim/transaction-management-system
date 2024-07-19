import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { PaginationDto } from '@app/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import ProcessorOneTransactionDto from './dto/upsertProcessorOne.dto';
import ProcessorTwoTransactionDto from './dto/upsertProcessorTwo.dto';
import getLoggerWithConfig from '@app/common/logger/logger';
import { of } from 'rxjs';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ApiKeyEnv } from './decorators/api-key-env.decorator';
import { GrpcExceptionFilter } from './filters/grpc-exception.filter';
import { API_VERSION } from './constants';

@ApiTags('transactions')
@Controller(`${API_VERSION}/transactions`)
@UseFilters(GrpcExceptionFilter)
export class TransactionsController {
  private readonly logger = getLoggerWithConfig(TransactionsController.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('one')
  @ApiOperation({ summary: 'Processor one - Upsert transaction' })
  @ApiResponse({
    status: 200,
    description: 'returns upserted transaction details',
  })
  @UseGuards(ApiKeyGuard)
  @ApiKeyEnv('PROCESSOR_ONE_API_KEY')
  firstProcessorWebhook(
    @Body() processorOneTransactionDto: ProcessorOneTransactionDto,
  ) {
    return this.transactionsService.upsertTransaction(
      processorOneTransactionDto,
    );
  }

  @Post('two')
  @ApiOperation({ summary: 'Processor two - Upsert transaction' })
  @ApiResponse({
    status: 200,
    description: 'returns upserted transaction details',
  })
  @UseGuards(ApiKeyGuard)
  @ApiKeyEnv('PROCESSOR_TWO_API_KEY')
  secondProcessorWebhook(
    @Body() processorTwoTransactionDto: ProcessorTwoTransactionDto,
  ) {
    return this.transactionsService.upsertTransaction(
      processorTwoTransactionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all transactions' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  queryTransactionsPaginated(@Query() paginationDto: PaginationDto) {
    const pagedDto: PaginationDto = {
      processorId: paginationDto.processorId,
      page: paginationDto.page || 10,
      skip: paginationDto.skip || 0,
    };
    return this.transactionsService.queryTransactions(of(pagedDto));
  }
}
