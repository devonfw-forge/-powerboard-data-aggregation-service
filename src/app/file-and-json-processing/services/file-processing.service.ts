import { Injectable } from '@nestjs/common';
import { IFileProcessingService } from './file-processing.service.interface';

@Injectable()
export class FileProcessingService implements IFileProcessingService {
    constructor() { }

    processFile(): any {
        return "Working"
    }
}