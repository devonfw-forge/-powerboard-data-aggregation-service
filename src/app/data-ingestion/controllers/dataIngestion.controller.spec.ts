import { Test, TestingModule } from '@nestjs/testing';
import { DataIngestionMockService } from '../../../../test/MockedServices/dataIngestion.service.mock';
import { DataIngestionController } from './dataIngestion.controller';

describe('Data-Aggregation', () => {
  let dataIngestionController: DataIngestionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DataIngestionController],
      providers: [
        {
          provide: 'IDataIngestionService',
          useClass: DataIngestionMockService,
        },
      ],
    }).compile();

    dataIngestionController = app.get<DataIngestionController>(DataIngestionController);
  });

  it('should be defined after module initialization', () => {
    expect(dataIngestionController).toBeDefined();
  });
});
