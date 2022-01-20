import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JsonProcessingService } from '../file-and-json-processing/services/json-processing.service';
import { DataIngestionController } from './controllers/dataIngestion.controller';
import { Sprint } from './model/entities/sprint.entity';
import { SprintStatus } from './model/entities/sprint_status.entity';
import { SprintWorkUnit } from './model/entities/sprint_work_unit.entity';
import { Team } from './model/entities/team.entity';
import { DataIngestionService } from './services/data-ingestion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint, SprintStatus, SprintWorkUnit, Team])],
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
