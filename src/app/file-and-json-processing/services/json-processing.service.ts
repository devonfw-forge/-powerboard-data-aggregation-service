import { Injectable } from '@nestjs/common';
import { IJsonProcessingService } from './json-processing.service.interface';

@Injectable()
export class JsonProcessingService implements IJsonProcessingService {
    constructor() { }

    processJson(): any {

    }
}