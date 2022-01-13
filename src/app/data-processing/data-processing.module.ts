import { Module } from '@nestjs/common';
import { FileAndJsonProcessingModule } from '../file-and-json-processing/file-and-json-processing.module';
import { DataProcessingController } from './controllers/dataProcessing.controller';
import { DataProcessingService } from './services/data-processing.service';

@Module({
  imports: [FileAndJsonProcessingModule],
  providers: [
    {
      provide: 'IDataProcessingService',
      useClass: DataProcessingService,
    },
  ],
  controllers: [DataProcessingController],
  exports: ['IDataProcessingService'],
})
export class DataProcessingModule {}
