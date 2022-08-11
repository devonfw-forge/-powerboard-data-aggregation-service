import { Test, TestingModule } from '@nestjs/testing';
import { DataAggregationMockService } from '../../../../test/MockedServices/dataAggregation.service.mock';
import { DataAggregationController } from './data-aggregation.controller';

describe('Data-Aggregation', () => {
  let dataAggregationController: DataAggregationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DataAggregationController],
      providers: [
        {
          provide: 'IDataAggregationService',
          useClass: DataAggregationMockService,
        },
      ],
    }).compile();

    dataAggregationController = app.get<DataAggregationController>(DataAggregationController);
  });

  it('should be defined after module initialization', () => {
    expect(dataAggregationController).toBeDefined();
  });
});
