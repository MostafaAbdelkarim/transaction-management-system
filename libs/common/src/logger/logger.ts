import { Logger } from '@nestjs/common';

function getLoggerWithConfig(className?: string): Logger {
  if (className === '' || className === null) {
    return new Logger();
  }
  return new Logger(className, { timestamp: true });
}

export default getLoggerWithConfig;
