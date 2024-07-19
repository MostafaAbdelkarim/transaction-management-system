import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionDetailModel } from '../models/transaction-details.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TransactionDetailRepository {
  constructor(
    @InjectModel(TransactionDetailModel)
    private readonly transactionDetailRepository: typeof TransactionDetailModel,

    private readonly sequelize: Sequelize,
  ) {}

  async bulkInsertTransactionDetails(
    transactionId: string,
    details: { name: string; value: string }[],
  ): Promise<TransactionDetailModel[]> {
    const transaction = await this.sequelize.transaction();

    try {
      await this.transactionDetailRepository.destroy({
        where: { transactionId },
        transaction,
      });

      const newDetails = await this.transactionDetailRepository.bulkCreate(
        details.map((detail) => ({
          ...detail,
          transactionId,
        })),
        { transaction },
      );

      await transaction.commit();

      return newDetails;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
