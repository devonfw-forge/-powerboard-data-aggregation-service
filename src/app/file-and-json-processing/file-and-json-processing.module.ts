import { Module } from '@nestjs/common';
import { FileProcessingService } from './services/file-processing.service';
import { JsonProcessingService } from './services/json-processing.service';
import { ValidationService } from './services/validations.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'IFileProcessingService',
      useClass: FileProcessingService,
    },
    {
      provide: 'IJsonProcessingService',
      useClass: JsonProcessingService,
    },
    {
      provide: 'IValidationService',
      useClass: ValidationService,
    },
  ],
  controllers: [],
  exports: ['IFileProcessingService', 'IJsonProcessingService', 'IValidationService'],
})
export class FileAndJsonProcessingModule {}
