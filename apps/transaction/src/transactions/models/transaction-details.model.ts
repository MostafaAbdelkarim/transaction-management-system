import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { TransactionModel } from './transaction.model';
import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'transaction_details',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class TransactionDetailModel extends Model<TransactionDetailModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => TransactionModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'transaction_id',
  })
  transactionId: string;

  @BelongsTo(() => TransactionModel)
  transaction: TransactionModel;

  @Column
  name: string;

  @Column
  value: string;
}
