import { Test, TestingModule } from '@nestjs/testing';
import { JsonProcessingService } from './json-processing.service';

describe('JsonProcessingService', () => {
    let jsonProcessingService: JsonProcessingService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JsonProcessingService,
                {
                    provide: 'IJsonProcessingService',
                    useClass: JsonProcessingService,
                },
            ],
        }).compile();

        jsonProcessingService = module.get<JsonProcessingService>('IJsonProcessingService');
    });

    it('should be defined after module initialization', () => {
        expect(jsonProcessingService).toBeDefined();

    });

})
