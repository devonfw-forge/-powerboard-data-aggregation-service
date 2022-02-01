import { Test, TestingModule } from '@nestjs/testing';

import { DataIngestionService } from '../../data-ingestion/services/data-ingestion.service';
import { FileProcessingService } from '../../file-and-json-processing/services/file-processing.service';
import { JsonProcessingService } from '../../file-and-json-processing/services/json-processing.service';

//repo imports
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sprint } from '../../data-ingestion/model/entities/sprint.entity';
import { Team } from '../../data-ingestion/model/entities/team.entity';
import { SprintMetric } from '../../data-ingestion/model/entities/sprint_metric.entity';
import { SprintSnapshotMetric } from '../../data-ingestion/model/entities/sprintSnapshotMetric.entity';
import { SprintWorkUnit } from '../../data-ingestion/model/entities/sprint_work_unit.entity';
import { SprintSnapshot } from '../../data-ingestion/model/entities/sprintSnapshot.entity';
import { SprintStatus } from '../../data-ingestion/model/entities/sprint_status.entity';
import { SprintRepositoryMock, TeamRepositoryMock, SprintMetricRepositoryMock, SprintSnapshotMetricRepositoryMock, SprintWorkUnitRepositoryMock, SprintSnapshotRepositoryMock, SprintStatusRepositoryMock } from '../../../../test/mockCrudRepository/crudRepository.mock';
import { DataProcessingService } from '../../data-processing/services/data-processing.service';

describe('DataIngestionService', () => {
    let dataIngestionService: DataIngestionService;
    //repos
    let sprintRepo: SprintRepositoryMock;
    let teamRepo: TeamRepositoryMock;
    let sprintMetric: SprintMetricRepositoryMock;
    let sprintSnapshotmetricRepo: SprintSnapshotMetricRepositoryMock;
    let sprintWorkUnitRepo: SprintWorkUnitRepositoryMock;
    let sprintSnapshotRepo: SprintSnapshotRepositoryMock;
    let sprintStatusRepo: SprintStatusRepositoryMock;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DataProcessingService,
                DataIngestionService,
                FileProcessingService,
                JsonProcessingService,
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
                    provide: getRepositoryToken(Sprint),
                    useClass: SprintRepositoryMock,
                },
                {
                    provide: getRepositoryToken(Team),
                    useClass: TeamRepositoryMock,
                },
                {
                    provide: getRepositoryToken(SprintMetric),
                    useClass: SprintMetricRepositoryMock,
                },
                {
                    provide: getRepositoryToken(SprintSnapshotMetric),
                    useClass: SprintSnapshotMetricRepositoryMock,
                },
                {
                    provide: getRepositoryToken(SprintWorkUnit),
                    useClass: SprintWorkUnitRepositoryMock,
                },
                {
                    provide: getRepositoryToken(SprintSnapshot),
                    useClass: SprintSnapshotRepositoryMock,
                },
                {
                    provide: getRepositoryToken(SprintStatus),
                    useClass: SprintStatusRepositoryMock,
                },
            ],
        }).compile();


        dataIngestionService = module.get<DataIngestionService>('IDataIngestionService');

        //repo get
        sprintRepo = module.get<SprintRepositoryMock>(getRepositoryToken(Sprint));
        teamRepo = module.get<TeamRepositoryMock>(getRepositoryToken(Team));
        sprintMetric = module.get<SprintMetricRepositoryMock>(getRepositoryToken(SprintMetric));
        sprintSnapshotmetricRepo = module.get<SprintSnapshotMetricRepositoryMock>(getRepositoryToken(SprintSnapshotMetric));
        sprintWorkUnitRepo = module.get<SprintWorkUnitRepositoryMock>(getRepositoryToken(SprintWorkUnit));
        sprintStatusRepo = module.get<SprintStatusRepositoryMock>(getRepositoryToken(SprintStatus));
        sprintSnapshotRepo = module.get<SprintSnapshotRepositoryMock>(getRepositoryToken(SprintSnapshot));
    });

    it('should be defined after module initialization', () => {

        expect(dataIngestionService).toBeDefined();
        expect(sprintRepo).toBeDefined();
        expect(teamRepo).toBeDefined();
        expect(sprintMetric).toBeDefined();
        expect(sprintSnapshotmetricRepo).toBeDefined();
        expect(sprintWorkUnitRepo).toBeDefined();
        expect(sprintSnapshotRepo).toBeDefined();
        expect(sprintStatusRepo).toBeDefined();
    });

    it('', async () => {

    })
})