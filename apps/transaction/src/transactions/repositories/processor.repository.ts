import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProcessorModel } from '../models/processor.model';

@Injectable()
export class ProcessorRepository {
  constructor(
    @InjectModel(ProcessorModel)
    private readonly transactionModel: typeof ProcessorModel,
  ) {}

  async findById(id: string): Promise<ProcessorModel | null> {
    return await this.transactionModel.findByPk(id);
  }
}
