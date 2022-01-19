import { Module } from '@nestjs/common';
import { JsonProcessingService } from '../file-and-json-processing/services/json-processing.service';
import { DataIngestionController } from './controllers/dataIngestion.controller';
import { DataIngestionService } from './services/data-ingestion.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'IDataIngestionService',
      useClass: DataIngestionService,
    },
    {
      provide: 'IJsonProcessingService',
      useClass: JsonProcessingService,
    },

  ],
  controllers: [DataIngestionController],
  exports: ['IDataIngestionService'],
})
export class DataIngestionModule { }
