import { Test, TestingModule } from '@nestjs/testing';
import {
  ClientStatusRepositoyMock,
  CodeQualitySnapshotRepositoryMock,
  SprintMetricRepositoryMock,
  SprintRepositoryMock,
  SprintSnapshotMetricRepositoryMock,
  SprintSnapshotRepositoryMock,
  SprintStatusRepositoryMock,
  SprintWorkUnitRepositoryMock,
  TeamRepositoryMock,
  TeamSpiritRepositoryMock,
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
import { CodeQualitySnapshot } from '../../data-ingestion/model/entities/code-quality-snapshot.entity';
import { ValidationService } from '../../file-and-json-processing/services/validations.service';
import { TeamSpirit } from '../../data-ingestion/model/entities/team-spirit.entity';
import { ClientStatus } from '../../data-ingestion/model/entities/client-status.entity';
describe('DataProcessingService', () => {
  let dataProcessingService: DataProcessingService;
  let dataIngestionService: DataIngestionService;
  let fileProcessingService: FileProcessingService;
  let jsonProcessingService: JsonProcessingService;
  let validationService: ValidationService;
  //repos
  let sprintRepo: SprintRepositoryMock;
  let teamRepo: TeamRepositoryMock;
  let sprintMetric: SprintMetricRepositoryMock;
  let sprintSnapshotmetricRepo: SprintSnapshotMetricRepositoryMock;
  let sprintWorkUnitRepo: SprintWorkUnitRepositoryMock;
  let sprintSnapshotRepo: SprintSnapshotRepositoryMock;
  let sprintStatusRepo: SprintStatusRepositoryMock;
  let codeQualitySnapshotRepo: CodeQualitySnapshotRepositoryMock;
  let teamSpiritRepo: TeamSpiritRepositoryMock;
  let clientStatus: ClientStatusRepositoyMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataProcessingService,
        DataIngestionService,
        FileProcessingService,
        JsonProcessingService,
        ValidationService,
        {
          provide: 'IDataProcessingService',
          useClass: DataProcessingService,
        },
        {
          provide: 'IValidationService',
          useClass: ValidationService,
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
        {
          provide: getRepositoryToken(CodeQualitySnapshot),
          useClass: CodeQualitySnapshotRepositoryMock,
        },
        {
          provide: getRepositoryToken(TeamSpirit),
          useClass: TeamSpiritRepositoryMock,
        },
        {
          provide: getRepositoryToken(ClientStatus),
          useClass: ClientStatusRepositoyMock,
        },
      ],
    }).compile();

    dataProcessingService = module.get<DataProcessingService>('IDataProcessingService');
    dataIngestionService = module.get<DataIngestionService>('IDataIngestionService');
    fileProcessingService = module.get<FileProcessingService>('IFileProcessingService');
    jsonProcessingService = module.get<JsonProcessingService>('IJsonProcessingService');
    validationService = module.get<ValidationService>('IValidationService');
    //repo get
    sprintRepo = module.get<SprintRepositoryMock>(getRepositoryToken(Sprint));
    teamRepo = module.get<TeamRepositoryMock>(getRepositoryToken(Team));
    sprintMetric = module.get<SprintMetricRepositoryMock>(getRepositoryToken(SprintMetric));
    sprintSnapshotmetricRepo = module.get<SprintSnapshotMetricRepositoryMock>(getRepositoryToken(SprintSnapshotMetric));
    sprintWorkUnitRepo = module.get<SprintWorkUnitRepositoryMock>(getRepositoryToken(SprintWorkUnit));
    sprintStatusRepo = module.get<SprintStatusRepositoryMock>(getRepositoryToken(SprintStatus));
    sprintSnapshotRepo = module.get<SprintSnapshotRepositoryMock>(getRepositoryToken(SprintSnapshot));
    codeQualitySnapshotRepo = module.get<CodeQualitySnapshotRepositoryMock>(getRepositoryToken(CodeQualitySnapshot));
    teamSpiritRepo = module.get<TeamSpiritRepositoryMock>(getRepositoryToken(TeamSpirit));
    clientStatus = module.get<ClientStatusRepositoyMock>(getRepositoryToken(ClientStatus));
  });

  it('should be defined after module initialization', () => {
    expect(dataProcessingService).toBeDefined();
    expect(dataIngestionService).toBeDefined();
    expect(fileProcessingService).toBeDefined();
    expect(jsonProcessingService).toBeDefined();
    expect(validationService).toBeDefined();
    expect(sprintRepo).toBeDefined();
    expect(teamRepo).toBeDefined();
    expect(sprintMetric).toBeDefined();
    expect(sprintSnapshotmetricRepo).toBeDefined();
    expect(sprintWorkUnitRepo).toBeDefined();
    expect(sprintSnapshotRepo).toBeDefined();
    expect(sprintStatusRepo).toBeDefined();
    expect(codeQualitySnapshotRepo).toBeDefined();
    expect(teamSpiritRepo).toBeDefined();
    expect(clientStatus).toBeDefined();
  });

  it('should process data', async () => {
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

    let ingestOutput: any = [
      {
        sprint_number: 7,
        status: '11155bf3-ada5-495c-8019-8d7ab76d488e',
        start_date: '2021-05-03T10:20:47.121Z',
        end_date: '2021-05-24T10:20:00.000Z',
        work_unit: '11155bf1-ada5-495c-8019-8d7ab76d488e',
        team: {
          id: '46455bf7-ada7-495c-8019-8d7ab76d488e',
          version: 4,
          createdAt: '2021-10-27T09:32:05.185Z',
          updatedAt: '2021-12-09T11:05:26.732Z',
          name: 'Team A',
          teamCode: '10012345',
          projectKey: 'P12343',
          logo: 'logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png',
          isStatusChanged: false,
          ad_center: {
            id: '99055bf7-ada7-495c-8019-8d7ab62d488e',
            version: 1,
            createdAt: '2021-10-27T09:32:05.185Z',
            updatedAt: '2021-10-27T09:32:05.185Z',
            name: 'ADCenter Bangalore',
          },
          team_status: {
            id: 3,
            status: 'potential_risks',
            description: 'If everything is not good',
          },
        },
        id: '2de76983-a0ff-41df-8457-b624ea76c661',
        version: 1,
        createdAt: '2022-01-31T17:44:49.942Z',
        updatedAt: '2022-01-31T17:44:49.942Z',
      },
    ];

    jest.spyOn(jsonProcessingService, 'processJson').mockResolvedValue(jsonObj);
    jest.spyOn(dataProcessingService, 'ingestEntities').mockResolvedValue(ingestOutput);
    /* const ingestedData = jest.spyOn(dataIngestionService, 'ingestCodeQuality').mockResolvedValue(ingestOutput); */
    const result = await dataProcessingService.processJSON(jsonObj, 'mockTeamId', 'mockType');
    expect(result).toEqual(ingestOutput);
  });

  it('should process xlsx data', async () => {
    let file: any = { file: 'mockXlsxFile' };
    let sampleFile: any = [];
    let ingestOutput: any = 'MockOutput';
    jest.spyOn(fileProcessingService, 'processXLSXFile').mockResolvedValue(sampleFile);
    jest.spyOn(dataProcessingService, 'ingestEntities').mockResolvedValue(ingestOutput);
    const result = await dataProcessingService.processXLSXfile(file, 'mockTeamId', 'mockType');
    expect(result).toEqual(ingestOutput);
  });

  it('should ingest jira entities ', async () => {
    let jiraData: any = 'MockJiraProcessedData';
    let processedData: any = 'MockProcessedjiraData';
    jest.spyOn(dataIngestionService, 'ingestJira').mockResolvedValue(jiraData);
    const result = await dataProcessingService.ingestEntities(processedData, 'jira', 'mockTeamId');
    expect(result).toEqual(jiraData);
  });

  it('should ingest code Quality entities ', async () => {
    let sonarData: any = 'MockCodeQualitiProcessedData';
    let processedData: any = 'MockProcessedCodeQualityData';
    jest.spyOn(dataIngestionService, 'ingestCodeQuality').mockResolvedValue(sonarData);
    const result = await dataProcessingService.ingestEntities(processedData, 'sonar', 'mockTeamId');
    expect(result).toEqual(sonarData);
  });

  it('should ingest team spirit entities ', async () => {
    let teamSpiritData: any = 'MockTeamSpiritProcessedData';
    let processedData: any = 'MockProcessedTeamSpiritData';
    jest.spyOn(dataIngestionService, 'ingestTeamSpirit').mockResolvedValue(teamSpiritData);
    const result = await dataProcessingService.ingestEntities(processedData, 'teamspirit', 'mockTeamId');
    expect(result).toEqual(teamSpiritData);
  });

  it('should ingest client status entities ', async () => {
    let clientStatusData: any = 'MockClientStatusProcessedData';
    let processedData: any = 'MockProcessedClientStatusData';
    jest.spyOn(dataIngestionService, 'ingestClientStatus').mockResolvedValue(clientStatusData);
    const result = await dataProcessingService.ingestEntities(processedData, 'clientstatus', 'mockTeamId');
    expect(result).toEqual(clientStatusData);
  });
});
