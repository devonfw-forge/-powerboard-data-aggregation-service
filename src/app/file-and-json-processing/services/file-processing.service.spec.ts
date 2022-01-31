import { Test, TestingModule } from '@nestjs/testing';
import { FileProcessingService } from './file-processing.service';

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
});
