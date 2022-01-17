import { Module } from '@nestjs/common';
import { DataIngestionService } from './services/data-ingestion.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'IDataIngestionService',
      useClass: DataIngestionService,
    },
  ],
  controllers: [],
  exports: ['IDataIngestionService'],
})
export class DataIngestionModule {}
