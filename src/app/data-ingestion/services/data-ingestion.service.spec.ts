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
import {
  SprintRepositoryMock,
  TeamRepositoryMock,
  SprintMetricRepositoryMock,
  SprintSnapshotMetricRepositoryMock,
  SprintWorkUnitRepositoryMock,
  SprintSnapshotRepositoryMock,
  SprintStatusRepositoryMock,
  CodeQualitySnapshotRepositoryMock,
  TeamSpiritRepositoryMock,
  ClientStatusRepositoyMock,
} from '../../../../test/mockCrudRepository/crudRepository.mock';
import { DataProcessingService } from '../../data-processing/services/data-processing.service';
// import { ADCenter } from '../model/entities/ad-center.entity';
// import { TeamStatus } from '../model/entities/team_status.entity';
import { CodeQualitySnapshot } from '../model/entities/code-quality-snapshot.entity';
import { TeamSpirit } from '../model/entities/team-spirit.entity';
import { ClientStatus } from '../model/entities/client-status.entity';
import { ValidationService } from '../../file-and-json-processing/services/validations.service';

describe('DataIngestionService', () => {
  let dataIngestionService: DataIngestionService;
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
  let clientStatusRepo: ClientStatusRepositoyMock;
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
          provide: getRepositoryToken(CodeQualitySnapshot),
          useClass: CodeQualitySnapshotRepositoryMock,
        },
        {
          provide: getRepositoryToken(SprintStatus),
          useClass: SprintStatusRepositoryMock,
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

    dataIngestionService = module.get<DataIngestionService>('IDataIngestionService');
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
    clientStatusRepo = module.get<ClientStatusRepositoyMock>(getRepositoryToken(ClientStatus));
  });

  it('should be defined after module initialization', () => {
    expect(dataIngestionService).toBeDefined();
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
    expect(clientStatusRepo).toBeDefined();
  });
  describe('persistEntities()', () => {
    const sprint: any = {
      sprint_number: 7,
      status: '11155bf3-ada5-495c-8019-8d7ab76d488e',
      start_date: '2021-05-03T10:20:47.121Z',
      end_date: '2021-05-24T10:20:00.000Z',
      work_unit: '11155bf1-ada5-495c-8019-8d7ab76d488e',
      team: {
        id: '46455bf7-ada7-495c-8019-8d7ab76d488e',
        version: 2,
        createdAt: '2021-10-27T09:06:57.732Z',
        updatedAt: '2021-10-27T09:08:19.906Z',
        name: 'Team A',
        teamCode: '10012345',
        projectKey: 'P12343',
        logo: 'logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png',
        isStatusChanged: false,
        ad_center: {
          id: '99055bf7-ada7-495c-8019-8d7ab62d488e',
          version: 1,
          createdAt: '2021-10-27T09:06:57.732Z',
          updatedAt: '2021-10-27T09:06:57.732Z',
          name: 'ADCenter Bangalore',
        },
        team_status: {
          id: 1,
          status: 'on_track',
          description: 'If everything is all right',
        },
      },
    };

    const sprintMetric = {
      id: '11155bf1-ada5-495c-8019-8d7ab76d488e',
      version: 1,
      createdAt: '2021-10-27T09:06:57.732Z',
      updatedAt: '2021-10-27T09:06:57.732Z',
      name: 'Work Committed',
    };

    it('it should be defined if all the entities get persisted', async () => {
      const sprintSnapshotSaved: any = {};
      const sprintSnapshotMetricSaved: any = {};
      const sprintCreated: any = {};
      const sprintSnapshot: any = {};
      const sprintSnapshotMetricCreated: any = {};

      jest.spyOn(sprintRepo, 'save').mockImplementation(() => sprintCreated);
      jest.spyOn(dataIngestionService, 'createSprintSnapshotEntity').mockImplementation(() => sprintSnapshot);
      jest.spyOn(sprintSnapshotRepo, 'save').mockImplementation(() => sprintSnapshotSaved);
      jest
        .spyOn(dataIngestionService, 'createSprintSnapshotMetricEntity')
        .mockImplementation(() => sprintSnapshotMetricCreated);
      jest.spyOn(sprintSnapshotmetricRepo, 'save').mockImplementation(() => sprintSnapshotMetricSaved);
      expect(dataIngestionService.persistEntities(sprint, '100', sprintMetric)).toBeDefined();
      expect(dataIngestionService.persistEntities(sprint, '100', sprintMetric)).toBeTruthy();
      const response = await dataIngestionService.persistEntities(sprint, '100', sprintMetric);
      expect(response).toEqual('success');
    });
    it('it should return failure if sprint entity is not persisted', async () => {
      jest.spyOn(sprintRepo, 'save').mockImplementation(undefined);
      const response = await dataIngestionService.persistEntities(sprint, '100', sprintMetric);
      expect(response).toEqual('failure');
      //expect(dataIngestionService.persistEntities(sprint, '100', sprintMetric)).toBeUndefined();
    });

    it('it should return failure if sprintSnapshot entity is not persisted', async () => {
      const sprintCreated = {};
      const sprintSnapshot: any = {};
      jest.spyOn(sprintRepo, 'save').mockImplementation(() => sprintCreated);
      jest.spyOn(dataIngestionService, 'createSprintSnapshotEntity').mockImplementation(() => sprintSnapshot);
      jest.spyOn(sprintSnapshotRepo, 'save').mockImplementation(() => undefined);
      const response = await dataIngestionService.persistEntities(sprint, '100', sprintMetric);
      expect(response).toEqual('failure');
    });
    it('it should return failure if sprintSnapshotMetric entity is not persisted', async () => {
      const sprintCreated = {};
      const sprintSnapshot: any = {};
      const sprintSnapshotSaved: any = {};
      const sprintSnapshotMetricCreated: any = {};
      jest.spyOn(sprintRepo, 'save').mockImplementation(() => sprintCreated);
      jest.spyOn(dataIngestionService, 'createSprintSnapshotEntity').mockImplementation(() => sprintSnapshot);
      jest.spyOn(sprintSnapshotRepo, 'save').mockImplementation(() => sprintSnapshotSaved);
      jest
        .spyOn(dataIngestionService, 'createSprintSnapshotMetricEntity')
        .mockImplementation(() => sprintSnapshotMetricCreated);
      jest.spyOn(sprintSnapshotmetricRepo, 'save').mockImplementation(undefined);
      const response = await dataIngestionService.persistEntities(sprint, '100', sprintMetric);
      expect(response).toEqual('failure');
    });
  });

  describe('createSprintSnapshotEntity()', () => {
    it('should create and return a sprint snapshot object', async () => {
      const sprint: any = {
        sprint_number: 7,
        status: '11155bf3-ada5-495c-8019-8d7ab76d488e',
        start_date: '2021-05-03T10:20:47.121Z',
        end_date: '2021-05-24T10:20:00.000Z',
        work_unit: '11155bf1-ada5-495c-8019-8d7ab76d488e',
        team: {
          id: '46455bf7-ada7-495c-8019-8d7ab76d488e',
          version: 2,
          createdAt: '2021-10-27T09:06:57.732Z',
          updatedAt: '2021-10-27T09:08:19.906Z',
          name: 'Team A',
          teamCode: '10012345',
          projectKey: 'P12343',
          logo: 'logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png',
          isStatusChanged: false,
          ad_center: {
            id: '99055bf7-ada7-495c-8019-8d7ab62d488e',
            version: 1,
            createdAt: '2021-10-27T09:06:57.732Z',
            updatedAt: '2021-10-27T09:06:57.732Z',
            name: 'ADCenter Bangalore',
          },
          team_status: {
            id: 1,
            status: 'on_track',
            description: 'If everything is all right',
          },
        },
      };

      const sprintSnapshot = {
        sprint: sprint,
        date_time: '2021-05-03T10:20:47.121Z',
      };
      const response = dataIngestionService.createSprintSnapshotEntity(sprint);
      expect(response).toEqual(sprintSnapshot);
    });
  });

  describe('createSprintSnapshotEntity()', () => {
    it('should create and return a sprint snapshot metric object', async () => {
      const sprint: any = {
        sprint_number: 7,
        status: '11155bf3-ada5-495c-8019-8d7ab76d488e',
        start_date: '2021-05-03T10:20:47.121Z',
        end_date: '2021-05-24T10:20:00.000Z',
        work_unit: '11155bf1-ada5-495c-8019-8d7ab76d488e',
        team: {
          id: '46455bf7-ada7-495c-8019-8d7ab76d488e',
          version: 2,
          createdAt: '2021-10-27T09:06:57.732Z',
          updatedAt: '2021-10-27T09:08:19.906Z',
          name: 'Team A',
          teamCode: '10012345',
          projectKey: 'P12343',
          logo: 'logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png',
          isStatusChanged: false,
          ad_center: {
            id: '99055bf7-ada7-495c-8019-8d7ab62d488e',
            version: 1,
            createdAt: '2021-10-27T09:06:57.732Z',
            updatedAt: '2021-10-27T09:06:57.732Z',
            name: 'ADCenter Bangalore',
          },
          team_status: {
            id: 1,
            status: 'on_track',
            description: 'If everything is all right',
          },
        },
      };

      const value = '100';

      const sprintMetric: any = {
        name: 'work committed',
      };
      const sprintSnapshot: any = {
        sprint: sprint,
        date_time: '2021-05-03T10:20:47.121Z',
      };
      const sprintSnapshotMetric: any = {
        value: value,
        snapshot: sprintSnapshot,
        metric: sprintMetric,
      };

      const response = await dataIngestionService.createSprintSnapshotMetricEntity(value, sprintSnapshot, sprintMetric);
      expect(response).toEqual(sprintSnapshotMetric);
    });
  });

  describe('ingestJira()', () => {
    //inputs
    const teamId = '46455bf7-ada7-495c-8019-8d7ab76d488e';
    const processedJSON: any = [
      {
        properties: [
          { key: 'maxResults', value: 50 },
          { key: 'startAt', value: 0 },
          { key: 'isLast', value: true },
          { key: 'values_0_id', value: 7 },
          {
            key: 'values_0_self',
            value: 'https://powerboard-capgemini.atlassian.net/rest/agile/1.0/sprint/7',
          },
          { key: 'values_0_state', value: 'active' },
          { key: 'values_0_name', value: 'DUM Sprint 4' },
          { key: 'values_0_startDate', value: '2021-05-03T10:20:47.121Z' },
          { key: 'values_0_endDate', value: '2021-05-24T10:20:00.000Z' },
          { key: 'values_0_originBoardId', value: 3 },
          { key: 'values_0_goal', value: '' },
          { key: 'values_0_status', value: '' },
          { key: 'values_0_workUnit', value: 'hour' },
          { key: 'values_0_value', value: 100 },
          { key: 'values_0_metric', value: 'Work Committed' },
        ],
      },
    ];

    it('should return sprint object', async () => {
      const sprintStatus = {
        id: '11155bf3-ada5-495c-8019-8d7ab76d488e',
        version: 1,
        createdAt: '2021-10-27T09:06:57.732Z',
        updatedAt: '2021-10-27T09:06:57.732Z',
        status: 'Completed',
      };

      const sprintWorkUnit = {
        id: '11155bf1-ada5-495c-8019-8d7ab76d488e',
        version: 1,
        createdAt: '2021-10-27T09:06:57.732Z',
        updatedAt: '2021-10-27T09:06:57.732Z',
        work_unit: 'hour',
      };

      const sprintMetric = {
        id: '11155bf1-ada5-495c-8019-8d7ab76d488e',
        version: 1,
        createdAt: '2021-10-27T09:06:57.732Z',
        updatedAt: '2021-10-27T09:06:57.732Z',
        name: 'Work Committed',
      };

      const team = {
        id: '46455bf7-ada7-495c-8019-8d7ab76d488e',
        version: 2,
        createdAt: '2021-10-27T09:06:57.732Z',
        updatedAt: '2021-10-27T09:08:19.906Z',
        name: 'Team A',
        teamCode: '10012345',
        projectKey: 'P12343',
        logo: 'logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png',
        isStatusChanged: false,
        ad_center: {
          id: '99055bf7-ada7-495c-8019-8d7ab62d488e',
          version: 1,
          createdAt: '2021-10-27T09:06:57.732Z',
          updatedAt: '2021-10-27T09:06:57.732Z',
          name: 'ADCenter Bangalore',
        },
        team_status: {
          id: 1,
          status: 'on_track',
          description: 'If everything is all right',
        },
      };

      const expectedResponse = [
        {
          sprint_number: 7,
          status: '11155bf3-ada5-495c-8019-8d7ab76d488e',
          start_date: '2021-05-03T10:20:47.121Z',
          end_date: '2021-05-24T10:20:00.000Z',
          work_unit: '11155bf1-ada5-495c-8019-8d7ab76d488e',
          team: {
            id: '46455bf7-ada7-495c-8019-8d7ab76d488e',
            version: 2,
            createdAt: '2021-10-27T09:06:57.732Z',
            updatedAt: '2021-10-27T09:08:19.906Z',
            name: 'Team A',
            teamCode: '10012345',
            projectKey: 'P12343',
            logo: 'logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png',
            isStatusChanged: false,
            ad_center: {
              id: '99055bf7-ada7-495c-8019-8d7ab62d488e',
              version: 1,
              createdAt: '2021-10-27T09:06:57.732Z',
              updatedAt: '2021-10-27T09:06:57.732Z',
              name: 'ADCenter Bangalore',
            },
            team_status: {
              id: 1,
              status: 'on_track',
              description: 'If everything is all right',
            },
          },
        },
      ];

      const persistResult: any = 'success';

      jest.spyOn(sprintStatusRepo, 'findOne').mockImplementation(() => sprintStatus);
      jest.spyOn(sprintWorkUnitRepo, 'findOne').mockImplementation(() => sprintWorkUnit);
      jest.spyOn(sprintSnapshotmetricRepo, 'findOne').mockImplementation(() => sprintMetric);
      jest.spyOn(teamRepo, 'findOne').mockImplementation(() => team);
      jest.spyOn(dataIngestionService, 'persistEntities').mockImplementation(() => persistResult);
      const actualResponse = await dataIngestionService.ingestJira(processedJSON, teamId);
      expect(actualResponse).toEqual(expectedResponse);
    });

    // it('should return undefined if the repository does not find the team object', async () => {
    //     const sprintStatus = {}
    //     const sprintWorkUnit = {}
    //     jest.spyOn(sprintStatusRepo, 'findOne').mockImplementation(() => sprintStatus);
    //     jest.spyOn(sprintWorkUnitRepo, 'findOne').mockImplementation(() => sprintWorkUnit);
    //     jest.spyOn(sprintSnapshotmetricRepo, 'findOne').mockImplementation(() => sprintMetric);
    //     jest.spyOn(teamRepo, 'findOne').mockImplementation(() => undefined);
    //     const response = await dataIngestionService.ingestJira(processedJSON, teamId)
    //     expect(response).toEqual(undefined)

    // })
  });

  describe('ingestCodeQuality()', () => {
    //inputs
    const teamId = '46455bf7-ada7-495c-8019-8d7ab76d488e';
    const processedJSON: any = [
      {
        properties: [
          { key: 'key', value: '123' },
          { key: 'title', value: 'Add feature X' },
          { key: 'branch', value: 'feature/bar' },
          { key: 'base', value: 'feature/foo' },
          { key: 'status_qualityGateStatus', value: 'OK' },
          { key: 'status_bugs', value: 1000 },
          { key: 'status_vulnerabilities', value: 100 },
          { key: 'status_codeSmells', value: 20 },
          { key: 'status_codeCoverage', value: 581 },
          { key: 'analysisDate', value: '2017-04-01T02:15:42+0200' },
          {
            key: 'url',
            value: 'https://github.com/SonarSource/sonar-core-plugins/pull/32',
          },
          { key: 'target', value: 'feature/foo' },
          {
            key: 'commit_sha',
            value: 'P1A5AxmsWdy1WPk0YRk48lVPDuYcy4EgUjtm2oGXt6LKdM6YS9',
          },
          { key: 'contributors_0_name', value: 'Foo Bar' },
          { key: 'contributors_0_login', value: 'foobar@github' },
          { key: 'contributors_0_avatar', value: '' },
        ],
      },
    ];

    it('should return codeQuality object', async () => {
      const teamResult = {
        id: '46455bf7-ada7-495c-8019-8d7ab76d488e',
        version: 1,
        createdAt: '2021-10-26T13:11:59.086Z',
        updatedAt: '2021-10-26T13:11:59.086Z',
        name: 'Team A',
        teamCode: '10012345',
        projectKey: 'P12343',
        logo: 'logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png',
        isStatusChanged: true,
        ad_center: {
          id: '99055bf7-ada7-495c-8019-8d7ab62d488e',
          version: 1,
          createdAt: '2021-10-26T13:11:59.086Z',
          updatedAt: '2021-10-26T13:11:59.086Z',
          name: 'ADCenter Bangalore',
        },
        team_status: {
          id: 1,
          status: 'on_track',
          description: 'If everything is all right',
        },
      };

      const expectedResponse = [
        {
          status: 'OK',
          bugs: 1000,
          codeSmells: 20,
          code_coverage: 581,
          snapshot_time: '2017-04-01T02:15:42+0200',
          team: {
            id: '46455bf7-ada7-495c-8019-8d7ab76d488e',
            version: 1,
            createdAt: '2021-10-26T13:11:59.086Z',
            updatedAt: '2021-10-26T13:11:59.086Z',
            name: 'Team A',
            teamCode: '10012345',
            projectKey: 'P12343',
            logo: 'logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png',
            isStatusChanged: true,
            ad_center: {
              id: '99055bf7-ada7-495c-8019-8d7ab62d488e',
              version: 1,
              createdAt: '2021-10-26T13:11:59.086Z',
              updatedAt: '2021-10-26T13:11:59.086Z',
              name: 'ADCenter Bangalore',
            },
            team_status: {
              id: 1,
              status: 'on_track',
              description: 'If everything is all right',
            },
          },
          id: '2d74f779-ba5c-48f5-9a3d-be4cda2df5a3',
          version: 1,
          createdAt: '2022-02-03T08:59:43.289Z',
          updatedAt: '2022-02-03T08:59:43.289Z',
        },
      ];

      const result: any = {
        status: 'OK',
        bugs: 1000,
        codeSmells: 20,
        code_coverage: 581,
        snapshot_time: '2017-04-01T02:15:42+0200',
        team: {
          id: '46455bf7-ada7-495c-8019-8d7ab76d488e',
          version: 1,
          createdAt: '2021-10-26T13:11:59.086Z',
          updatedAt: '2021-10-26T13:11:59.086Z',
          name: 'Team A',
          teamCode: '10012345',
          projectKey: 'P12343',
          logo: 'logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png',
          isStatusChanged: true,
          ad_center: {
            id: '99055bf7-ada7-495c-8019-8d7ab62d488e',
            version: 1,
            createdAt: '2021-10-26T13:11:59.086Z',
            updatedAt: '2021-10-26T13:11:59.086Z',
            name: 'ADCenter Bangalore',
          },
          team_status: {
            id: 1,
            status: 'on_track',
            description: 'If everything is all right',
          },
        },
        id: '2d74f779-ba5c-48f5-9a3d-be4cda2df5a3',
        version: 1,
        createdAt: '2022-02-03T08:59:43.289Z',
        updatedAt: '2022-02-03T08:59:43.289Z',
      };

      jest.spyOn(teamRepo, 'findOne').mockImplementation(() => teamResult);
      jest.spyOn(dataIngestionService, 'persistCodeQuality').mockImplementation(() => result);
      const actualResponse = await dataIngestionService.ingestCodeQuality(processedJSON, teamId);
      expect(actualResponse).toEqual(expectedResponse);
    });
  });

  describe('persistCodeQuality()', () => {
    //Input
    const codeQuality: any = {
      status: 'OK',
      bugs: 1000,
      codeSmells: 20,
      code_coverage: 581,
      snapshot_time: '2017-04-01T02:15:42+0200',
      team: {
        id: '46455bf7-ada7-495c-8019-8d7ab76d488e',
        version: 1,
        createdAt: '2021-10-26T13:11:59.086Z',
        updatedAt: '2021-10-26T13:11:59.086Z',
        name: 'Team A',
        teamCode: '10012345',
        projectKey: 'P12343',
        logo: 'logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png',
        isStatusChanged: true,
        ad_center: {
          id: '99055bf7-ada7-495c-8019-8d7ab62d488e',
          version: 1,
          createdAt: '2021-10-26T13:11:59.086Z',
          updatedAt: '2021-10-26T13:11:59.086Z',
          name: 'ADCenter Bangalore',
        },
        team_status: {
          id: 1,
          status: 'on_track',
          description: 'If everything is all right',
        },
      },
    };

    it('it should be defined if entity get persisted', async () => {
      const result: any = {
        status: 'OK',
        bugs: 1000,
        codeSmells: 20,
        code_coverage: 581,
        snapshot_time: '2017-04-01T02:15:42+0200',
        team: {
          id: '46455bf7-ada7-495c-8019-8d7ab76d488e',
          version: 1,
          createdAt: '2021-10-26T13:11:59.086Z',
          updatedAt: '2021-10-26T13:11:59.086Z',
          name: 'Team A',
          teamCode: '10012345',
          projectKey: 'P12343',
          logo: 'logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png',
          isStatusChanged: true,
          ad_center: {
            id: '99055bf7-ada7-495c-8019-8d7ab62d488e',
            version: 1,
            createdAt: '2021-10-26T13:11:59.086Z',
            updatedAt: '2021-10-26T13:11:59.086Z',
            name: 'ADCenter Bangalore',
          },
          team_status: {
            id: 1,
            status: 'on_track',
            description: 'If everything is all right',
          },
        },
        id: '2d74f779-ba5c-48f5-9a3d-be4cda2df5a3',
        version: 1,
        createdAt: '2022-02-03T08:59:43.289Z',
        updatedAt: '2022-02-03T08:59:43.289Z',
      };

      jest.spyOn(codeQualitySnapshotRepo, 'save').mockImplementation(() => result);
      expect(dataIngestionService.persistCodeQuality(codeQuality)).toBeDefined();
      expect(dataIngestionService.persistCodeQuality(codeQuality)).toBeTruthy();
      const response = await dataIngestionService.persistCodeQuality(codeQuality);
      expect(response).toEqual(result);
    });
  });

  describe('ingestTeamSpirit()', () => {
    it('it should persist and return the team spirit entity', async () => {
      //inputs
      const teamId = '46455bf7-ada7-495c-8019-8d7ab76d488e';
      const processedJSON: any = [
        {
          properties: [
            { key: 'teamSpiritRating', value: '10' },
            { key: 'name', value: 'test' },
          ],
        },
      ];
      const activeSprint = {
        sprint_id: '20955bf8-ada5-495c-8019-8d7ab76d488e',
        sprint_version: 1,
        sprint_createdAt: '2021-10-27T09:06:57.732Z',
        sprint_updatedAt: '2021-10-27T09:06:57.732Z',
        sprint_sprint_number: 22,
        sprint_start_date: '2021-10-21T10:00:15.000Z',
        sprint_end_date: '2021-11-18T10:00:15.000Z',
        sprint_status: '11155bf2-ada5-495c-8019-8d7ab76d488e',
        sprint_team_id: '46455bf7-ada7-495c-8019-8d7ab76d491e',
        sprint_work_unit: '11155bf1-ada5-495c-8019-8d7ab76d488e',
        st_status: 'In Progress',
        id: '20955bf8-ada5-495c-8019-8d7ab76d488e',
      };

      const savedEntity: any = {
        team_spirit_rating: 10,
        sprint: {
          sprint_id: '20955bf8-ada5-495c-8019-8d7ab76d488e',
          sprint_version: 1,
          sprint_createdAt: '2021-10-27T09:06:57.732Z',
          sprint_updatedAt: '2021-10-27T09:06:57.732Z',
          sprint_sprint_number: 22,
          sprint_start_date: '2021-10-21T10:00:15.000Z',
          sprint_end_date: '2021-11-18T10:00:15.000Z',
          sprint_status: '11155bf2-ada5-495c-8019-8d7ab76d488e',
          sprint_team_id: '46455bf7-ada7-495c-8019-8d7ab76d491e',
          sprint_work_unit: '11155bf1-ada5-495c-8019-8d7ab76d488e',
          st_status: 'In Progress',
          id: '20955bf8-ada5-495c-8019-8d7ab76d488e',
        },
        id: 'e58b540b-c0f2-4309-b75e-81c7a67760d6',
        version: 1,
        createdAt: '2022-02-14T04:48:04.663Z',
        updatedAt: '2022-02-14T04:48:04.663Z',
      };

      const createQueryBuilder: any = {
        where: () => createQueryBuilder,
        addSelect: () => createQueryBuilder,
        innerJoin: () => createQueryBuilder,
        andWhere: () => createQueryBuilder,
        getRawOne: jest.fn().mockResolvedValue(activeSprint),
      };

      jest.spyOn(sprintRepo, 'createQueryBuilder').mockImplementation(() => createQueryBuilder);
      jest.spyOn(dataIngestionService, 'persistTeamSpiritEntity').mockImplementation(() => savedEntity);
      const actualResponse = await dataIngestionService.ingestTeamSpirit(processedJSON, teamId);
      expect(actualResponse).toEqual(savedEntity);
    });
  });

  describe('persistTeamSpiritEntity()', () => {
    it('it should call save method of repository and persist the entity', async () => {
      const teamSpirit: any = {};
      await dataIngestionService.persistTeamSpiritEntity(teamSpirit);
      expect(teamSpiritRepo.save).toHaveBeenCalled();
    });
  });

  describe('ingestClientStatus()', () => {
    it('should persist and return the client status entity', async () => {
      //inputs
      const teamId = '46455bf7-ada7-495c-8019-8d7ab76d488e';
      const processedJSON: any = [
        {
          properties: [
            { key: 'clientRating', value: '12' },
            { key: 'name', value: 'test' },
          ],
        },
      ];
      const activeSprint = {
        sprint_id: '20955bf8-ada5-495c-8019-8d7ab76d488e',
        sprint_version: 1,
        sprint_createdAt: '2021-10-27T09:06:57.732Z',
        sprint_updatedAt: '2021-10-27T09:06:57.732Z',
        sprint_sprint_number: 22,
        sprint_start_date: '2021-10-21T10:00:15.000Z',
        sprint_end_date: '2021-11-18T10:00:15.000Z',
        sprint_status: '11155bf2-ada5-495c-8019-8d7ab76d488e',
        sprint_team_id: '46455bf7-ada7-495c-8019-8d7ab76d491e',
        sprint_work_unit: '11155bf1-ada5-495c-8019-8d7ab76d488e',
        st_status: 'In Progress',
        id: '20955bf8-ada5-495c-8019-8d7ab76d488e',
      };

      const savedEntity: any = {
        client_rating: 10,
        sprint: {
          sprint_id: '20955bf8-ada5-495c-8019-8d7ab76d488e',
          sprint_version: 1,
          sprint_createdAt: '2021-10-27T09:06:57.732Z',
          sprint_updatedAt: '2021-10-27T09:06:57.732Z',
          sprint_sprint_number: 22,
          sprint_start_date: '2021-10-21T10:00:15.000Z',
          sprint_end_date: '2021-11-18T10:00:15.000Z',
          sprint_status: '11155bf2-ada5-495c-8019-8d7ab76d488e',
          sprint_team_id: '46455bf7-ada7-495c-8019-8d7ab76d491e',
          sprint_work_unit: '11155bf1-ada5-495c-8019-8d7ab76d488e',
          st_status: 'In Progress',
          id: '20955bf8-ada5-495c-8019-8d7ab76d488e',
        },
        id: 'e58b540b-c0f2-4309-b75e-81c7a67760d6',
        version: 1,
        createdAt: '2022-02-14T04:48:04.663Z',
        updatedAt: '2022-02-14T04:48:04.663Z',
      };

      const createQueryBuilder: any = {
        where: () => createQueryBuilder,
        addSelect: () => createQueryBuilder,
        innerJoin: () => createQueryBuilder,
        andWhere: () => createQueryBuilder,
        getRawOne: jest.fn().mockResolvedValue(activeSprint),
      };

      jest.spyOn(sprintRepo, 'createQueryBuilder').mockImplementation(() => createQueryBuilder);
      jest.spyOn(dataIngestionService, 'persistClientStatusEntity').mockImplementation(() => savedEntity);
      const actualResponse = await dataIngestionService.ingestClientStatus(processedJSON, teamId);
      expect(actualResponse).toEqual(savedEntity);
    });
  });

  describe('persistClientStatusEntity()', () => {
    it('it should call save method of repository and persist the entity', async () => {
      const clientStatus: any = {};
      await dataIngestionService.persistClientStatusEntity(clientStatus);
      expect(clientStatusRepo.save).toHaveBeenCalled();
    });
  });
});
