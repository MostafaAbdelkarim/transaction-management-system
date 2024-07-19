import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { ProcessorModel } from './processor.model';
import { TransactionDetailModel } from './transaction-details.model';
import { v4 as uuidv4 } from 'uuid';
import { Currency, TransactionStatus } from '@app/common';

@Table({
  tableName: 'transactions',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class TransactionModel extends Model<TransactionModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  id: string;

  @ForeignKey(() => ProcessorModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'processor_id',
  })
  processorId: string;

  @BelongsTo(() => ProcessorModel)
  processor: ProcessorModel;

  @Column({
    type: DataType.DECIMAL,
  })
  amount: number;

  @Column({
    type: DataType.DECIMAL,
    field: 'card_limit',
  })
  cardLimit: number;

  @Column({
    type: DataType.ENUM(...Object.values(Currency)),
    allowNull: true,
  })
  currency: Currency;

  // considering there exists accounts table which can be used as FK
  @Column({
    type: DataType.UUID,
    field: 'account_id',
  })
  accountId: string;

  // considering there exists cards table which can be used as FK
  @Column({
    type: DataType.UUID,
    field: 'card_id',
  })
  cardId: string;

  // considering there exists merchants table which can be used as FK
  @Column({
    type: DataType.UUID,
    field: 'merchant_id',
  })
  merchantId: string;

  // considering there exists pos table which can be used as FK
  @Column({
    type: DataType.UUID,
    field: 'pos_id',
  })
  posId: string;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionStatus)),
  })
  status: TransactionStatus;

  @HasMany(() => TransactionDetailModel)
  details: TransactionDetailModel[];
}
