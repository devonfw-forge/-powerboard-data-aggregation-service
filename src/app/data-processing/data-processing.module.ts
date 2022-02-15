import { Module } from '@nestjs/common';
import { DataIngestionModule } from '../data-ingestion/data-ingestion.module';
import { FileAndJsonProcessingModule } from '../file-and-json-processing/file-and-json-processing.module';
import { ValidationService } from '../file-and-json-processing/services/validations.service';
import { DataProcessingController } from './controllers/dataProcessing.controller';
import { DataProcessingService } from './services/data-processing.service';

@Module({
  imports: [FileAndJsonProcessingModule, DataIngestionModule],
  providers: [
    {
      provide: 'IDataProcessingService',
      useClass: DataProcessingService,
    },
    {
      provide: 'IValidateService',
      useClass: ValidationService,
    },
  ],
  controllers: [DataProcessingController],
  exports: ['IDataProcessingService'],
})
export class DataProcessingModule {}
