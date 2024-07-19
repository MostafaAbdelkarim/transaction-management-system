import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'processors',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProcessorModel extends Model<ProcessorModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  id: string;

  @Column
  name: string;
}
