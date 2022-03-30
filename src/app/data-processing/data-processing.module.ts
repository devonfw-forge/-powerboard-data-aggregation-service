import { HttpModule, Module } from '@nestjs/common';
import { DataIngestionModule } from '../data-ingestion/data-ingestion.module';
import { FileAndJsonProcessingModule } from '../file-and-json-processing/file-and-json-processing.module';
import { DataProcessingController } from './controllers/dataProcessing.controller';
import { DataProcessingService } from './services/data-processing.service';

@Module({
  imports: [FileAndJsonProcessingModule, DataIngestionModule, HttpModule],
  providers: [
    {
      provide: 'IDataProcessingService',
      useClass: DataProcessingService,
    },
  ],
  controllers: [DataProcessingController],
  exports: ['IDataProcessingService'],
})
export class DataProcessingModule { }
