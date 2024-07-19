import { Injectable } from '@nestjs/common';
import { TransactionModel } from '../models/transaction.model'; // Import your Sequelize model
import { InjectModel } from '@nestjs/sequelize';
import getLoggerWithConfig from '@app/common/logger/logger';
import { PaginationDto, TransactionStatus } from '@app/common';

@Injectable()
export class TransactionRepository {
  private readonly logger = getLoggerWithConfig(TransactionRepository.name);
  constructor(
    @InjectModel(TransactionModel)
    private readonly transactionModel: typeof TransactionModel,
  ) {}

  async create(data: any): Promise<TransactionModel> {
    return await this.transactionModel.create(data);
  }

  async findAll({
    processorId,
    page,
    skip,
  }: PaginationDto): Promise<TransactionModel[]> {
    const where: any = processorId ? { processorId: processorId } : {};
    page = page ? page : 10;
    return await this.transactionModel.findAll({
      where,
      limit: page,
      offset: skip,
    });
  }

  async findById(id: string): Promise<TransactionModel | null> {
    return await this.transactionModel.findByPk(id);
  }

  async findByIdAndProcessorId(
    id: string,
    processorId: string,
  ): Promise<TransactionModel> {
    this.logger.log(
      `transactionId[${id}] | attempting to find transaction with given id and processor_id`,
    );

    try {
      const transaction = await this.transactionModel.findOne({
        where: { processorId: processorId, id: id },
      });

      return transaction;
    } catch (error) {
      this.logger.error(`transactionId[${id}] | error: ${error.message}`);
    }
  }

  async update(
    id: string,
    processorId: string,
    data: any,
  ): Promise<TransactionModel> {
    const [numberOfAffectedRows, affectedRows] =
      await this.transactionModel.update(data, {
        where: {
          id: id,
          processorId: processorId,
        },
        returning: true,
      });

    if (numberOfAffectedRows === 0) {
      throw new Error('No record found to update');
    }

    return affectedRows[0];
  }
}
