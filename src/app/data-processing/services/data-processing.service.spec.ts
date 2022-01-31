import { Test, TestingModule } from '@nestjs/testing';
import {
  SprintMetricRepositoryMock,
  SprintRepositoryMock,
  SprintSnapshotMetricRepositoryMock,
  SprintSnapshotRepositoryMock,
  SprintStatusRepositoryMock,
  SprintWorkUnitRepositoryMock,
  TeamRepositoryMock,
} from '../../../../test/mockCrudRepository/crudRepository.mock';
import { DataIngestionService } from '../../data-ingestion/services/data-ingestion.service';
import { FileProcessingService } from '../../file-and-json-processing/services/file-processing.service';
import { JsonProcessingService } from '../../file-and-json-processing/services/json-processing.service';
import { DataProcessingService } from './data-processing.service';
//repo imports
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sprint } from '../../data-ingestion/model/entities/sprint.entity';
import { Team } from '../../data-ingestion/model/entities/team.entity';
import { SprintMetric } from '../../data-ingestion/model/entities/sprint_metric.entity';
import { SprintSnapshotMetric } from '../../data-ingestion/model/entities/sprintSnapshotMetric.entity';
import { SprintWorkUnit } from '../../data-ingestion/model/entities/sprint_work_unit.entity';
import { SprintSnapshot } from '../../data-ingestion/model/entities/sprintSnapshot.entity';
import { SprintStatus } from '../../data-ingestion/model/entities/sprint_status.entity';
describe('DataProcessingService', () => {
  let dataProcessingService: DataProcessingService;
  let dataIngestionService: DataIngestionService;
  let fileProcessingService: FileProcessingService;
  let jsonProcessingService: JsonProcessingService;
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

    dataProcessingService = module.get<DataProcessingService>('IDataProcessingService');
    dataIngestionService = module.get<DataIngestionService>('IDataIngestionService');
    fileProcessingService = module.get<FileProcessingService>('IFileProcessingService');
    jsonProcessingService = module.get<JsonProcessingService>('IJsonProcessingService');
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
    expect(dataProcessingService).toBeDefined();
    expect(dataIngestionService).toBeDefined();
    expect(fileProcessingService).toBeDefined();
    expect(jsonProcessingService).toBeDefined();
    expect(sprintRepo).toBeDefined();
    expect(teamRepo).toBeDefined();
    expect(sprintMetric).toBeDefined();
    expect(sprintSnapshotmetricRepo).toBeDefined();
    expect(sprintWorkUnitRepo).toBeDefined();
    expect(sprintSnapshotRepo).toBeDefined();
    expect(sprintStatusRepo).toBeDefined();
  });

  it('should process data', () => {
    let jsonObj: any = {
      maxResults: 50,
      startAt: 0,
      isLast: true,
      values: [
        {
          id: 7,
          self: 'https://powerboard-capgemini.atlassian.net/rest/agile/1.0/sprint/7',
          state: 'active',
          name: 'DUM Sprint 4',
          startDate: '2021-05-03T10:20:47.121Z',
          endDate: '2021-05-24T10:20:00.000Z',
          originBoardId: 3,
          goal: '',
          status: '',
          workUnit: 'hour',
          value: 100,
          metric: 'Work Committed',
        },
      ],
    };

    jest.spyOn(jsonProcessingService, 'processJson').mockResolvedValue(jsonObj);
    const ingestedData = jest.spyOn(dataIngestionService, 'ingestCodeQuality').mockResolvedValue(jsonObj);
    const result = dataProcessingService.processData(jsonObj, 'mockteamId');
    expect(result).toEqual(ingestedData);
  });
});
