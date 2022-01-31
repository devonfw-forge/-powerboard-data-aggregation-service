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

    it('flattenJSON', () => {
        const obj = {
            common: 1,
            parameters: {
                first_parameter: 'f',
                second_parameter: 's'
            }
        }
        let res: any = {};
        let extraKey = ''
        const expectedOutput = {
            "common": 1,
            "parameters_first_parameter": "f",
            "parameters_second_parameter": "s"
        }
        expect(jsonProcessingService.flattenJSON(obj, res, extraKey)).toEqual(expectedOutput);

    });

    it('processJson', () => {
        const obj = {
            common: 1,
            parameters: {
                first_parameter: 'f',
                second_parameter: 's'
            }
        }
        const flattenedObj =
        {
            common: 1,
            parameters_first_parameter: "f",
            parameters_second_parameter: "s"
        }

        let expectedResponse = [{
            properties: [
                {
                    key: "common",
                    value: 1,
                },
                {
                    key: "parameters_first_parameter",
                    value: "f",
                },
                {
                    key: "parameters_second_parameter",
                    value: "s",
                },
            ]
        }]

        jest.spyOn(jsonProcessingService, 'flattenJSON').mockImplementation(() => flattenedObj);

        expect(jsonProcessingService.processJson(obj)).toEqual(expectedResponse);
    })

})
