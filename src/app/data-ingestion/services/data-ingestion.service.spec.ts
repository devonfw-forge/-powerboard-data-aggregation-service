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
import { SprintRepositoryMock, TeamRepositoryMock, SprintMetricRepositoryMock, SprintSnapshotMetricRepositoryMock, SprintWorkUnitRepositoryMock, SprintSnapshotRepositoryMock, SprintStatusRepositoryMock, CodeQualitySnapshotRepositoryMock } from '../../../../test/mockCrudRepository/crudRepository.mock';
import { DataProcessingService } from '../../data-processing/services/data-processing.service';
// import { ADCenter } from '../model/entities/ad-center.entity';
// import { TeamStatus } from '../model/entities/team_status.entity';
import { CodeQualitySnapshot } from '../model/entities/code-quality-snapshot.entity';

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
    let codeQualitySnapshotRepo: CodeQualitySnapshotRepositoryMock;
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
                    provide: getRepositoryToken(CodeQualitySnapshot),
                    useClass: CodeQualitySnapshotRepositoryMock,
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
        codeQualitySnapshotRepo = module.get<CodeQualitySnapshotRepositoryMock>(getRepositoryToken(CodeQualitySnapshot));
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
        expect(codeQualitySnapshotRepo).toBeDefined();
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
                    createdAt: "2021-10-27T09:06:57.732Z",
                    updatedAt: "2021-10-27T09:06:57.732Z",
                    name: 'ADCenter Bangalore'
                },
                team_status: {
                    id: 1,
                    status: 'on_track',
                    description: 'If everything is all right'
                }
            }
        }

        const sprintMetric = {
            id: '11155bf1-ada5-495c-8019-8d7ab76d488e',
            version: 1,
            createdAt: '2021-10-27T09:06:57.732Z',
            updatedAt: '2021-10-27T09:06:57.732Z',
            name: 'Work Committed'
        }

        it('it should be defined if all the entities get persisted', async () => {

            const sprintSnapshotSaved: any = {}
            const sprintSnapshotMetricSaved: any = {}
            const sprintCreated: any = {}
            const sprintSnapshot: any = {}
            const sprintSnapshotMetricCreated: any = {}

            jest.spyOn(sprintRepo, 'save').mockImplementation(() => sprintCreated);
            jest.spyOn(dataIngestionService, 'createSprintSnapshotEntity').mockImplementation(() => sprintSnapshot);
            jest.spyOn(sprintSnapshotRepo, 'save').mockImplementation(() => sprintSnapshotSaved);
            jest.spyOn(dataIngestionService, 'createSprintSnapshotMetricEntity').mockImplementation(() => sprintSnapshotMetricCreated);
            jest.spyOn(sprintSnapshotmetricRepo, 'save').mockImplementation(() => sprintSnapshotMetricSaved);
            expect(dataIngestionService.persistEntities(sprint, '100', sprintMetric)).toBeDefined();
            expect(dataIngestionService.persistEntities(sprint, '100', sprintMetric)).toBeTruthy();
            const response = await dataIngestionService.persistEntities(sprint, '100', sprintMetric);
            expect(response).toEqual('success');
        })
        it('it should return failure if sprint entity is not persisted', async () => {

            jest.spyOn(sprintRepo, 'save').mockImplementation(undefined);
            const response = await dataIngestionService.persistEntities(sprint, '100', sprintMetric);
            expect(response).toEqual('failure')
            //expect(dataIngestionService.persistEntities(sprint, '100', sprintMetric)).toBeUndefined();
        })

        it('it should return failure if sprintSnapshot entity is not persisted', async () => {
            const sprintCreated = {}
            const sprintSnapshot: any = {}
            jest.spyOn(sprintRepo, 'save').mockImplementation(() => sprintCreated);
            jest.spyOn(dataIngestionService, 'createSprintSnapshotEntity').mockImplementation(() => sprintSnapshot);
            jest.spyOn(sprintSnapshotRepo, 'save').mockImplementation(() => undefined);
            const response = await dataIngestionService.persistEntities(sprint, '100', sprintMetric);
            expect(response).toEqual('failure')

        })
        it('it should return failure if sprintSnapshotMetric entity is not persisted', async () => {
            const sprintCreated = {}
            const sprintSnapshot: any = {}
            const sprintSnapshotSaved: any = {}
            const sprintSnapshotMetricCreated: any = {}
            jest.spyOn(sprintRepo, 'save').mockImplementation(() => sprintCreated);
            jest.spyOn(dataIngestionService, 'createSprintSnapshotEntity').mockImplementation(() => sprintSnapshot);
            jest.spyOn(sprintSnapshotRepo, 'save').mockImplementation(() => sprintSnapshotSaved);
            jest.spyOn(dataIngestionService, 'createSprintSnapshotMetricEntity').mockImplementation(() => sprintSnapshotMetricCreated);
            jest.spyOn(sprintSnapshotmetricRepo, 'save').mockImplementation(undefined);
            const response = await dataIngestionService.persistEntities(sprint, '100', sprintMetric);
            expect(response).toEqual('failure')

        })
    })

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
                        createdAt: "2021-10-27T09:06:57.732Z",
                        updatedAt: "2021-10-27T09:06:57.732Z",
                        name: 'ADCenter Bangalore'
                    },
                    team_status: {
                        id: 1,
                        status: 'on_track',
                        description: 'If everything is all right'
                    }
                }
            }

            const sprintSnapshot = {
                sprint: sprint,
                date_time: '2021-05-03T10:20:47.121Z'
            }
            const response = await dataIngestionService.createSprintSnapshotEntity(sprint);
            expect(response).toEqual(sprintSnapshot)
        })
    })

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
                        createdAt: "2021-10-27T09:06:57.732Z",
                        updatedAt: "2021-10-27T09:06:57.732Z",
                        name: 'ADCenter Bangalore'
                    },
                    team_status: {
                        id: 1,
                        status: 'on_track',
                        description: 'If everything is all right'
                    }
                }
            }

            const value = '100';

            const sprintMetric: any = {
                name: 'work committed'
            }
            const sprintSnapshot: any = {
                sprint: sprint,
                date_time: '2021-05-03T10:20:47.121Z'
            }
            const sprintSnapshotMetric: any = {
                value: value,
                snapshot: sprintSnapshot,
                metric: sprintMetric
            }

            const response = await dataIngestionService.createSprintSnapshotMetricEntity(value, sprintSnapshot, sprintMetric);
            expect(response).toEqual(sprintSnapshotMetric)

        })
    })

    describe('ingestJira()', () => {
        it('should return sprint object', async () => {
            //inputs
            const teamId = '46455bf7-ada7-495c-8019-8d7ab76d488e'
            const processedJSON: any = [
                {
                    properties: [
                        { key: 'maxResults', value: 50 },
                        { key: 'startAt', value: 0 },
                        { key: 'isLast', value: true },
                        { key: 'values_0_id', value: 7 },
                        {
                            key: 'values_0_self',
                            value: 'https://powerboard-capgemini.atlassian.net/rest/agile/1.0/sprint/7'
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
                        { key: 'values_0_metric', value: 'Work Committed' }
                    ]
                }
            ]

            const sprintStatus = {
                id: '11155bf3-ada5-495c-8019-8d7ab76d488e',
                version: 1,
                createdAt: '2021-10-27T09:06:57.732Z',
                updatedAt: '2021-10-27T09:06:57.732Z',
                status: 'Completed'
            }

            const sprintWorkUnit = {
                id: '11155bf1-ada5-495c-8019-8d7ab76d488e',
                version: 1,
                createdAt: '2021-10-27T09:06:57.732Z',
                updatedAt: '2021-10-27T09:06:57.732Z',
                work_unit: 'hour'
            }

            const sprintMetric = {
                id: '11155bf1-ada5-495c-8019-8d7ab76d488e',
                version: 1,
                createdAt: '2021-10-27T09:06:57.732Z',
                updatedAt: '2021-10-27T09:06:57.732Z',
                name: 'Work Committed'
            }

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
                    name: 'ADCenter Bangalore'
                },
                team_status: {
                    id: 1,
                    status: 'on_track',
                    description: 'If everything is all right'
                }
            }

            const expectedResponse = [
                {
                    "sprint_number": 7,
                    "status": "11155bf3-ada5-495c-8019-8d7ab76d488e",
                    "start_date": "2021-05-03T10:20:47.121Z",
                    "end_date": "2021-05-24T10:20:00.000Z",
                    "work_unit": "11155bf1-ada5-495c-8019-8d7ab76d488e",
                    "team": {
                        "id": "46455bf7-ada7-495c-8019-8d7ab76d488e",
                        "version": 2,
                        "createdAt": "2021-10-27T09:06:57.732Z",
                        "updatedAt": "2021-10-27T09:08:19.906Z",
                        "name": "Team A",
                        "teamCode": "10012345",
                        "projectKey": "P12343",
                        "logo": "logo_Aa4aa8e7a-85d6-4b75-8f93-6a11dee9b13c.png",
                        "isStatusChanged": false,
                        "ad_center": {
                            "id": "99055bf7-ada7-495c-8019-8d7ab62d488e",
                            "version": 1,
                            "createdAt": "2021-10-27T09:06:57.732Z",
                            "updatedAt": "2021-10-27T09:06:57.732Z",
                            "name": "ADCenter Bangalore"
                        },
                        "team_status": {
                            "id": 1,
                            "status": "on_track",
                            "description": "If everything is all right"
                        }
                    },
                }
            ]

            jest.spyOn(sprintStatusRepo, 'findOne').mockImplementation(() => sprintStatus);
            jest.spyOn(sprintWorkUnitRepo, 'findOne').mockImplementation(() => sprintWorkUnit);
            jest.spyOn(sprintSnapshotmetricRepo, 'findOne').mockImplementation(() => sprintMetric);
            jest.spyOn(teamRepo, 'findOne').mockImplementation(() => team);
            const actualResponse = await dataIngestionService.ingestJira(processedJSON, teamId);
            expect(actualResponse).toEqual(expectedResponse);
        })
    })
})