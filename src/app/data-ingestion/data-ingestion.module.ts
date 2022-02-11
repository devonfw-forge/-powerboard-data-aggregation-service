import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JsonProcessingService } from '../file-and-json-processing/services/json-processing.service';
import { DataIngestionController } from './controllers/dataIngestion.controller';
import { CodeQualitySnapshot } from './model/entities/code-quality-snapshot.entity';
import { Sprint } from './model/entities/sprint.entity';
import { SprintSnapshot } from './model/entities/sprintSnapshot.entity';
import { SprintSnapshotMetric } from './model/entities/sprintSnapshotMetric.entity';
import { SprintMetric } from './model/entities/sprint_metric.entity';
import { SprintStatus } from './model/entities/sprint_status.entity';
import { SprintWorkUnit } from './model/entities/sprint_work_unit.entity';
import { TeamSpirit } from './model/entities/team-spirit.entity';
import { Team } from './model/entities/team.entity';
import { DataIngestionService } from './services/data-ingestion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sprint,
      SprintStatus,
      SprintWorkUnit,
      Team,
      SprintMetric,
      SprintSnapshot,
      SprintSnapshotMetric,
      CodeQualitySnapshot,
      TeamSpirit
    ]),
  ],
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
