import { Module } from '@nestjs/common';
import { FileProcessingService } from './services/file-processing.service';
import { JsonProcessingService } from './services/json-processing.service';

@Module({
    imports: [],
    providers: [
        {
            provide: 'IFileProcessingService',
            useClass: FileProcessingService,
        },
        {
            provide: 'IJsonProcessingService',
            useClass: JsonProcessingService,
        },
    ],
    controllers: [],
    exports: ['IFileProcessingService', 'IJsonProcessingService'],
})
export class FileAndJsonProcessingModule { }