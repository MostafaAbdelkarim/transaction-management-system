import {
  Currency,
  ProcessorOneCurrency,
  ProcessorTwoCurrency,
} from '@app/common';

const nativeToProcessorOne: Record<Currency, string> = {
  [Currency.USD]: ProcessorOneCurrency.USD,
  [Currency.EUR]: ProcessorOneCurrency.EUR,
  [Currency.GBP]: ProcessorOneCurrency.GBP,
  [Currency.AED]: '',
  [Currency.EGP]: '',
};

const nativeToProcessorTwo: Record<Currency, string> = {
  [Currency.USD]: ProcessorTwoCurrency.USD,
  [Currency.EUR]: ProcessorTwoCurrency.EUR,
  [Currency.GBP]: ProcessorTwoCurrency.GBP,
  [Currency.AED]: '',
  [Currency.EGP]: '',
};

const processorOneToNative: Record<string, Currency> = {};
for (const [key, value] of Object.entries(nativeToProcessorOne)) {
  processorOneToNative[value] = key as Currency;
}

const processorTwoToNative: Record<string, Currency> = {};
for (const [key, value] of Object.entries(nativeToProcessorTwo)) {
  processorOneToNative[value] = key as Currency;
}

export function fromNativeCurrencyEnumValue(
  value: Currency,
  processor: 'one' | 'two',
): string {
  if (processor === 'one') {
    return nativeToProcessorOne[value];
  } else if (processor === 'two') {
    return nativeToProcessorTwo[value];
  } else {
    throw new Error(`Unsupported processor: ${processor}`);
  }
}

export function toNativeCurrencyEnumValue(
  value: string,
  processor: 'one' | 'two',
): Currency {
  if (processor === 'one') {
    return processorOneToNative[value];
  } else if (processor === 'two') {
    return processorTwoToNative[value];
  } else {
    throw new Error(`Unsupported processor: ${processor}`);
  }
}
