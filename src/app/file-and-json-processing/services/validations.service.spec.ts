import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validations.service';

describe('ValidationService', () => {
  let validationService: ValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidationService,
        {
          provide: 'IValidationService',
          useClass: ValidationService,
        },
      ],
    }).compile();

    validationService = module.get<ValidationService>('IValidationService');
  });

  it('should be defined after module initialization', () => {
    expect(validationService).toBeDefined();
  });

  it('should validate sonar', () => {
    const processedJson: any = [
      {
        properties: [
          {
            key: 'key',
            value: '123',
          },
          {
            key: 'title',
            value: 'Add feature X',
          },
          {
            key: 'branch',
            value: 'feature/bar',
          },
          {
            key: 'base',
            value: 'feature/foo',
          },
          {
            key: 'status_qualityGateStatus',
            value: 'OK',
          },
          {
            key: 'status_bugs',
            value: 7,
          },
          {
            key: 'status_vulnerabilities',
            value: 5,
          },
          {
            key: 'status_codeSmells',
            value: 20,
          },
          {
            key: 'status_codeCoverage',
            value: 58,
          },
          {
            key: 'analysisDate',
            value: '2017-04-01T02:15:42+0200',
          },
          {
            key: 'url',
            value: 'https://github.com/SonarSource/sonar-core-plugins/pull/32',
          },
          {
            key: 'target',
            value: 'feature/foo',
          },
          {
            key: 'commit_sha',
            value: 'P1A5AxmsWdy1WPk0YRk48lVPDuYcy4EgUjtm2oGXt6LKdM6YS9',
          },
          {
            key: 'contributors_0_name',
            value: 'Foo Bar',
          },
          {
            key: 'contributors_0_login',
            value: 'foobar@github',
          },
          {
            key: 'contributors_0_avatar',
            value: '',
          },
        ],
      },
    ];
    expect(true).toEqual(validationService.validateSonar(processedJson));
  });

  it('should be validate jira', () => {
    const processedJson: any = [
      {
        properties: [
          {
            key: 'maxResults',
            value: 50,
          },
          {
            key: 'startAt',
            value: 0,
          },
          {
            key: 'isLast',
            value: true,
          },
          {
            key: 'values_0_id',
            value: 7,
          },
          {
            key: 'values_0_self',
            value: 'https://powerboard-capgemini.atlassian.net/rest/agile/1.0/sprint/7',
          },
          {
            key: 'values_0_state',
            value: 'active',
          },
          {
            key: 'values_0_name',
            value: 'DUM Sprint 4',
          },
          {
            key: 'values_0_startDate',
            value: '2021-05-03T10:20:47.121Z',
          },
          {
            key: 'values_0_endDate',
            value: '2021-05-24T10:20:00.000Z',
          },
          {
            key: 'values_0_originBoardId',
            value: 3,
          },
          {
            key: 'values_0_goal',
            value: '',
          },
          {
            key: 'values_0_status',
            value: '',
          },
          {
            key: 'values_0_workUnit',
            value: 'hour',
          },
          {
            key: 'values_0_value',
            value: 200,
          },
          {
            key: 'values_0_metric',
            value: 'Work Committed',
          },
        ],
      },
    ];
    expect(true).toEqual(validationService.validateJira(processedJson));
  });

  /*    it('should check for incorrect type', () => {
        const processedJson : any = 
        [
         {
             "properties": [
                 {
                     "key": "key",
                     "value": "123"
                 },
                 {
                     "key": "title",
                     "value": "Add feature X"
                 },
                 {
                     "key": "branch",
                     "value": "feature/bar"
                 },
                 {
                     "key": "base",
                     "value": "feature/foo"
                 },
                 {
                     "key": "status_qualityGateStatus",
                     "value": 10
                 },
                 {
                     "key": "status_bugs",
                     "value": "7"
                 },
                 {
                     "key": "status_vulnerabilities",
                     "value": 5
                 },
                 {
                     "key": "status_codeSmells",
                     "value": 20
                 },
                 {
                     "key": "status_codeCoverage",
                     "value": 58
                 },
                 {
                     "key": "analysisDate",
                     "value": "2017-04-01T02:15:42+0200"
                 },
                 {
                     "key": "url",
                     "value": "https://github.com/SonarSource/sonar-core-plugins/pull/32"
                 },
                 {
                     "key": "target",
                     "value": "feature/foo"
                 },
                 {
                     "key": "commit_sha",
                     "value": "P1A5AxmsWdy1WPk0YRk48lVPDuYcy4EgUjtm2oGXt6LKdM6YS9"
                 },
                 {
                     "key": "contributors_0_name",
                     "value": "Foo Bar"
                 },
                 {
                     "key": "contributors_0_login",
                     "value": "foobar@github"
                 },
                 {
                     "key": "contributors_0_avatar",
                     "value": ""
                 }
             ]
         }
     ]
     expect(false).toEqual(validationService.validateSonar(processedJson));
     
     }); */
});
