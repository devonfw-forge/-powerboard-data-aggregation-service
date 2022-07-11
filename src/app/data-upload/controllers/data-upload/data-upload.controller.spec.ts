import { Test, TestingModule } from '@nestjs/testing';
import { DataUploadController } from './data-upload.controller';

describe('DataUploadController', () => {
  let controller: DataUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataUploadController],
    }).compile();

    controller = module.get<DataUploadController>(DataUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
