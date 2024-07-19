export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  AED = 'AED',
  EGP = 'EGP',
}

export enum ProcessorOneCurrency {
  USD = 'UNITED STATES DOLLAR',
  EUR = 'EURO',
  GBP = 'BRITISH POUND STERLING',
  // Add other currencies as needed
}

export enum ProcessorTwoCurrency {
  USD = '784',
  EUR = '978',
  GBP = '826',
}

export enum Network {
  MASTERCARD = 'MASTERCARD',
  VISA = 'VISA',
  AMEX = 'AMEX',
  DISCOVER = 'DISCOVER',
}

export enum NativeMessageType {
  AUTHORIZATION = 'AUTHORIZATION',
  CLEARING = 'CLEARING',
}

export enum ProcessorOneMessageType {
  AUTHORIZATION = 'AUTHORIZATION',
  CLEARING = 'CLEARING',
}

export enum ProcessorTwoMessageType {
  AUTHORIZATION = 'ACCOUNT_TRANSACTION_CREATED',
  CLEARING = 'ACCOUNT_TRANSACTION_POSTED',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum StatusCode {
  SUCCESS = '0000',
  FAILURE = '0001',
}

export enum PosEnvironment {
  ECommerce = 'E-Commerce',
  InStore = 'In-Store',
}

export enum Country {
  USA = 'USA',
  UAE = 'UAE',
}

export enum ProcessorTwoCardType {
  VISA = 'CARD_VISA',
  AMEX = 'CARD_AMEX',
  MASTERCARD = 'CARD_MASTERCARD_E_COMMERCE',
}

export enum ProcessorTwoCardNetwork {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}
