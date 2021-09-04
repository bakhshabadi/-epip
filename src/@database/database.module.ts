import { Module } from '@nestjs/common';
import { databaseProviders } from './postgres/moz/provider.database';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}