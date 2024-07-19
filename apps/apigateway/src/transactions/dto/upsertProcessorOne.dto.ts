import {
  IsEnum,
  IsUUID,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
} from 'class-validator';
import {
  Network,
  PosEnvironment,
  StatusCode,
  Currency,
  Country,
  ProcessorOneMessageType,
} from '@app/common';

export default class ProcessorOneTransactionDto {
  @IsUUID('4')
  id: string;

  @IsString()
  mcc: string;

  @IsString()
  rrn: string;

  @IsBoolean()
  moto: boolean;

  @IsString()
  stan: string;

  @IsUUID('4')
  card_id: string;

  @IsEnum(Network)
  network: Network;

  @IsUUID('4')
  user_id: string;

  @IsBoolean()
  fallback: boolean;

  @IsBoolean()
  recurring: boolean;

  @IsString()
  card_entry: string;

  @IsString()
  account_id1: string;

  @IsOptional()
  @IsString()
  acquirer_id?: string;

  @IsString({ each: true })
  fee_details: string[];

  @IsString()
  merchant_id: string;

  @IsBoolean()
  pin_present: boolean;

  @IsEnum(StatusCode)
  status_code: StatusCode;

  @IsString()
  terminal_id: string;

  @IsString()
  is_cancelled: string;

  @IsEnum(ProcessorOneMessageType)
  message_type: ProcessorOneMessageType;

  @IsString()
  merchant_city: string;

  @IsString()
  merchant_name: string;

  @IsNumber()
  billing_amount: number;

  @IsNumber()
  clearing_count: number;

  @IsNumber()
  reversal_count: number;

  @IsBoolean()
  is_cash_advance: boolean;

  @IsEnum(PosEnvironment)
  pos_environment: PosEnvironment;

  @IsString()
  auth_id_response: string;

  @IsEnum(Currency)
  billing_currency: Currency;

  @IsString()
  card_expiry_date: string;

  @IsEnum(Country)
  merchant_country: Country;

  @IsString()
  transaction_type: string;

  @IsString()
  card_last4_digits: string;

  @IsString()
  card_first6_digits: string;

  @IsOptional()
  @IsDateString()
  date_time_acquirer?: string;

  @IsString()
  status_description: string;

  @IsNumber()
  transaction_amount: number;

  @IsEnum(Currency)
  transaction_currency: Currency;

  @IsDateString()
  transaction_timestamp: string;

  @IsNumber()
  billing_amount_account: number;

  @IsString()
  network_transaction_id: string;

  @IsDateString()
  transmission_date_time: string;

  @IsString()
  conversion_rate_billing: string;

  @IsBoolean()
  incremental_transaction: boolean;

  @IsBoolean()
  installment_transaction: boolean;

  @IsString()
  transaction_description: string;

  @IsEnum(Currency)
  billing_currency_account: Currency;

  @IsNumber()
  conversion_rate_billing_account: number;

  // CLEARNING OPTIONAL ATTRIBUTES
  @IsOptional()
  @IsString()
  eci?: string;

  @IsOptional()
  @IsNumber()
  fee_amount?: number;

  @IsOptional()
  @IsString()
  clearing_id?: string;

  @IsOptional()
  @IsString()
  settlement_status?: string;

  @IsOptional()
  @IsUUID('4')
  parent_transaction_id?: string;
}
