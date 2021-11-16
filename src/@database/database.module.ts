import { Module } from '@nestjs/common';
import { DatabaseProviders } from './postgres/provider.database';

@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {}