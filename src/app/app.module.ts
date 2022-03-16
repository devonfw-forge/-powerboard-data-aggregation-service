import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { DataIngestionModule } from './data-ingestion/data-ingestion.module';
import { DataProcessingModule } from './data-processing/data-processing.module';

@Module({
  imports: [CoreModule, DataProcessingModule, DataIngestionModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
