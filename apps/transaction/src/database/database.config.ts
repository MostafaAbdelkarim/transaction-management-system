import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import getLoggerWithConfig from '@app/common/logger/logger';

dotenv.config();

export const createSequelizeConfig = async (
  configService: ConfigService,
): Promise<SequelizeModuleOptions> => {
  const sequelizeOptions: SequelizeModuleOptions = {
    dialect: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_NAME', 'postgres'),
    autoLoadModels: true,
    synchronize: true,
    logging: false,
  };

  const sequelize = new Sequelize(sequelizeOptions);
  const logger: Logger = getLoggerWithConfig('DatabaseConfig');

  try {
    await sequelize.authenticate();
    logger.log('Database connection has been established successfully 🚀');
    return sequelizeOptions;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw new Error('Database connection failed.');
  }
};
