import { Test, TestingModule } from '@nestjs/testing';
import { FileProcessingService } from './file-processing.service';
/* import xlsx from 'node-xlsx';
import { Group } from '../models/group'; */

describe('FileProcessingService', () => {
  let fileProcessingService: FileProcessingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileProcessingService,
        {
          provide: 'IFileProcessingService',
          useClass: FileProcessingService,
        },
      ],
    }).compile();

    fileProcessingService = module.get<FileProcessingService>('IFileProcessingService');
  });

  it('should be defined after module initialization', () => {
    expect(fileProcessingService).toBeDefined();
  });

  // it('should process xlsx data', async () => {
  //   const rowAverage: WorkS = [[{t: 'n', z: 10, f: '=AVERAGE(2:2)'}], [1, 2, 3]];
  //   var buffer = xlsx.build([{WorkSheet<unknown>}]);
  //   let sampleFile: any = [];
  //   let ingestOutput: any = 'MockOutput';
  //   jest.spyOn(fileProcessingService, 'processXLSXFile').mockResolvedValue(sampleFile);

  //   const result = await fileProcessingService.processXLSXFile(buffer);
  //   expect(result).toEqual(ingestOutput);
  // });

  it('should map file into object', async () => {
    let file: any = [
      {
        name: 'Sheet1',
        data: [
          ['bugs', 'code_smell', 'code_coverage', 'quality_gate', 'snapshot_time', 'team_id'],
          [5, 21, 80, 'PASSED', 44383.09091435185, '46455bf7-ada7-495c-8019-8d7ab76d490e'],
        ],
      },
    ];

    let output: any = [
      {
        properties: [
          { key: 'bugs', value: 5 },
          { key: 'code_smell', value: 21 },
          { key: 'code_coverage', value: 80 },
          { key: 'quality_gate', value: 'PASSED' },
          { key: 'snapshot_time', value: 44383.09091435185 },
          { key: 'team_id', value: '46455bf7-ada7-495c-8019-8d7ab76d490e' },
        ],
      },
    ];
    const result = await fileProcessingService.mapFileIntoObject(file);
    expect(result).toEqual(output);
  });
});
