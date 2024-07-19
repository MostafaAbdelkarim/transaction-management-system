import {
  IsUUID,
  IsEnum,
  IsDateString,
  IsNumberString,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ProcessorTwoCardNetwork,
  ProcessorTwoCardType,
  ProcessorTwoMessageType,
  TransactionStatus,
} from '@app/common';

class TransactionDetails {
  @IsOptional()
  @IsNumberString()
  oif: string;

  @IsOptional()
  @IsNumberString()
  token: string;

  @IsOptional()
  @IsEnum(['MC', 'VISA', 'AMEX']) // Example enum values
  network: string;

  @IsOptional()
  @IsNumberString()
  oif_vat: string;

  @IsOptional()
  @IsNumberString()
  vat_rate: string;

  @IsOptional()
  @IsNumberString()
  scheme_mcc: string;

  @IsOptional()
  @IsNumberString()
  tx_fx_rate: string;

  @IsOptional()
  @IsNumberString()
  paymentology_pid: string;

  @IsOptional()
  @IsNumberString()
  paymentology_tid: string;

  @IsOptional()
  @IsNumberString()
  principal_amount: string;

  @IsOptional()
  @IsNumberString()
  scheme_tx_amount: string;

  @IsOptional()
  @IsNumberString()
  scheme_acceptor_id: string;

  @IsOptional()
  @IsNumberString()
  scheme_terminal_id: string;

  @IsOptional()
  @IsNumberString()
  scheme_tx_currency: string;

  @IsOptional()
  @IsUUID('4')
  fast_message_log_id: string;

  @IsOptional()
  @IsOptional()
  scheme_acceptor_city: string;

  @IsOptional()
  @IsOptional()
  scheme_acceptor_name: string;

  @IsOptional()
  @IsNumberString()
  paymentology_auth_rid: string;

  @IsOptional()
  @IsNumberString()
  scheme_billing_amount: string;

  @IsOptional()
  @IsNumberString()
  scheme_billing_fx_rate: string;

  @IsOptional()
  @IsOptional()
  scheme_acceptor_country: string;

  @IsOptional()
  @IsNumberString()
  scheme_billing_currency: string;

  @IsOptional()
  @IsNumberString()
  scheme_settlement_amount: string;

  @IsOptional()
  scheme_tx_local_time: string;

  @IsOptional()
  @IsDateString()
  scheme_transmission_time: string;

  @IsOptional()
  @IsNumberString()
  scheme_settlement_fx_rate: string;

  @IsOptional()
  @IsNumberString()
  scheme_settlement_currency: string;

  @IsOptional()
  @IsNumberString()
  scheme_retrieval_reference_number: string;

  @IsOptional()
  @IsNumberString()
  scheme_systems_trace_audit_number: string;
}

class Transaction {
  @IsUUID('4')
  id: string;

  @IsEnum(ProcessorTwoCardType)
  type: ProcessorTwoCardType;

  @IsEnum(ProcessorTwoCardNetwork)
  dr_cr: ProcessorTwoCardNetwork;

  @IsNumberString()
  amount: number;

  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @ValidateNested()
  @Type(() => TransactionDetails)
  details: TransactionDetails;

  @IsNumberString()
  reference: string;

  @IsUUID('4')
  account_id: string;

  @IsDateString()
  created_at: string;

  @IsDateString()
  release_date: string;

  @IsOptional()
  @IsNumberString()
  scheme_merchant_id: string;
}

export default class ProcessorTwoTransactionDto {
  @IsUUID('4')
  id: string;

  @IsEnum(ProcessorTwoMessageType)
  type: ProcessorTwoMessageType;

  @IsOptional()
  createdAt: Date;

  @ValidateNested()
  @Type(() => Transaction)
  transaction: Transaction;
}
