import { Module } from '@nestjs/common';
import { DataProcessingModule } from '../data-processing/data-processing.module';
import { DataUploadController } from './controllers/data-upload/data-upload.controller';

@Module({
  imports: [DataProcessingModule],
  providers: [],
  controllers: [DataUploadController],
  exports: [],
})
export class DataUploadModule {}
