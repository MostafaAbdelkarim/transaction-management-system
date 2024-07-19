import {
  fromNativeCurrencyEnumValue,
  toNativeCurrencyEnumValue,
} from '@app/common';
import {
  Currency,
  ProcessorOneCurrency,
  ProcessorTwoCurrency,
} from '@app/common';

describe('Currency Enum Mapping', () => {
  describe('fromNativeCurrencyEnumValue', () => {
    it('should correctly map native currency to Processor One currency', () => {
      expect(fromNativeCurrencyEnumValue(Currency.USD, 'one')).toBe(
        ProcessorOneCurrency.USD,
      );
      expect(fromNativeCurrencyEnumValue(Currency.EUR, 'one')).toBe(
        ProcessorOneCurrency.EUR,
      );
      expect(fromNativeCurrencyEnumValue(Currency.GBP, 'one')).toBe(
        ProcessorOneCurrency.GBP,
      );
      expect(fromNativeCurrencyEnumValue(Currency.AED, 'one')).toBe('');
      expect(fromNativeCurrencyEnumValue(Currency.EGP, 'one')).toBe('');
    });

    it('should correctly map native currency to Processor Two currency', () => {
      expect(fromNativeCurrencyEnumValue(Currency.USD, 'two')).toBe(
        ProcessorTwoCurrency.USD,
      );
      expect(fromNativeCurrencyEnumValue(Currency.EUR, 'two')).toBe(
        ProcessorTwoCurrency.EUR,
      );
      expect(fromNativeCurrencyEnumValue(Currency.GBP, 'two')).toBe(
        ProcessorTwoCurrency.GBP,
      );
      expect(fromNativeCurrencyEnumValue(Currency.AED, 'two')).toBe('');
      expect(fromNativeCurrencyEnumValue(Currency.EGP, 'two')).toBe('');
    });

    it('should throw an error for unsupported processors', () => {
      expect(() =>
        fromNativeCurrencyEnumValue(Currency.USD, 'three' as any),
      ).toThrowError('Unsupported processor: three');
    });
  });

  describe('toNativeCurrencyEnumValue', () => {
    it('should correctly map Processor One currency to native currency', () => {
      expect(toNativeCurrencyEnumValue(ProcessorOneCurrency.USD, 'one')).toBe(
        Currency.USD,
      );
      expect(toNativeCurrencyEnumValue(ProcessorOneCurrency.EUR, 'one')).toBe(
        Currency.EUR,
      );
      expect(toNativeCurrencyEnumValue(ProcessorOneCurrency.GBP, 'one')).toBe(
        Currency.GBP,
      );
    });

    it('should throw an error for unsupported processors', () => {
      expect(() =>
        toNativeCurrencyEnumValue(ProcessorOneCurrency.USD, 'three' as any),
      ).toThrowError('Unsupported processor: three');
    });
  });
});
