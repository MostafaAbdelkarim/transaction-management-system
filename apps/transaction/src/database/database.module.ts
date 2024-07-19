import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { createSequelizeConfig } from './database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createSequelizeConfig(configService),
    }),
    SequelizeModule.forFeature([]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
