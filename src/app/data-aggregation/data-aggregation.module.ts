import { HttpModule } from '@nestjs/common';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientStatus } from '../data-ingestion/model/entities/client-status.entity';
import { CodeQualitySnapshot } from '../data-ingestion/model/entities/code-quality-snapshot.entity';
import { Sprint } from '../data-ingestion/model/entities/sprint.entity';
import { SprintSnapshot } from '../data-ingestion/model/entities/sprintSnapshot.entity';
import { SprintSnapshotMetric } from '../data-ingestion/model/entities/sprintSnapshotMetric.entity';
import { SprintMetric } from '../data-ingestion/model/entities/sprint_metric.entity';
import { SprintStatus } from '../data-ingestion/model/entities/sprint_status.entity';
import { SprintWorkUnit } from '../data-ingestion/model/entities/sprint_work_unit.entity';
import { TeamSpirit } from '../data-ingestion/model/entities/team-spirit.entity';
import { Team } from '../data-ingestion/model/entities/team.entity';
import { DataIngestionService } from '../data-ingestion/services/data-ingestion.service';
import { DataProcessingService } from '../data-processing/services/data-processing.service';
import { FileProcessingService } from '../file-and-json-processing/services/file-processing.service';
import { JsonProcessingService } from '../file-and-json-processing/services/json-processing.service';
import { ValidationService } from '../file-and-json-processing/services/validations.service';
import { DataAggregationController } from './controllers/data-aggregation.controller';
import { DataAggregationService } from './services/data-aggregation.service';

@Module({
    imports: [TypeOrmModule.forFeature([
        Sprint,
        SprintStatus,
        SprintWorkUnit,
        Team,
        SprintMetric,
        SprintSnapshot,
        SprintSnapshotMetric,
        CodeQualitySnapshot,
        TeamSpirit,
        ClientStatus,
    ]),
        HttpModule],

    providers: [
        {
            provide: 'IDataAggregationService',
            useClass: DataAggregationService,
        },
        {
            provide: 'IDataProcessingService',
            useClass: DataProcessingService,
        },
        {
            provide: 'IDataIngestionService',
            useClass: DataIngestionService,
        },
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

    controllers: [DataAggregationController],
    exports: ['IDataAggregationService'],
})
export class DataAggregationModule { }