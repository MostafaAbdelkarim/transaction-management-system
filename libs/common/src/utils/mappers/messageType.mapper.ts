import {
  NativeMessageType,
  ProcessorOneMessageType,
  ProcessorTwoMessageType,
} from '@app/common/types';

const nativeToProcessorOne: Record<NativeMessageType, string> = {
  [NativeMessageType.AUTHORIZATION]: ProcessorOneMessageType.AUTHORIZATION,
  [NativeMessageType.CLEARING]: ProcessorOneMessageType.CLEARING,
};

const nativeToProcessorTwo: Record<NativeMessageType, string> = {
  [NativeMessageType.AUTHORIZATION]: ProcessorTwoMessageType.AUTHORIZATION,
  [NativeMessageType.CLEARING]: ProcessorTwoMessageType.CLEARING,
};

const processorOneToNative: Record<string, NativeMessageType> = {};
for (const [key, value] of Object.entries(nativeToProcessorOne)) {
  processorOneToNative[value] = key as NativeMessageType;
}

const processorTwoToNative: Record<string, NativeMessageType> = {};
for (const [key, value] of Object.entries(nativeToProcessorTwo)) {
  processorTwoToNative[value] = key as NativeMessageType;
}

export function fromNativeMessageType(
  nativeMessageType: NativeMessageType,
  processor: 'one' | 'two',
): string {
  if (processor === 'one') {
    return nativeToProcessorOne[nativeMessageType];
  } else if (processor === 'two') {
    return nativeToProcessorTwo[nativeMessageType];
  } else {
    throw new Error(`Unsupported processor: ${processor}`);
  }
}

export function toNativeMessageType(
  processorMessageType: string,
  processor: 'one' | 'two',
): NativeMessageType {
  if (processor === 'one') {
    return processorOneToNative[
      processorMessageType as ProcessorOneMessageType
    ];
  } else if (processor === 'two') {
    return processorTwoToNative[
      processorMessageType as ProcessorTwoMessageType
    ];
  } else {
    throw new Error(`Unsupported processor: ${processor}`);
  }
}
