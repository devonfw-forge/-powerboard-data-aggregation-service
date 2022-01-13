import { Inject, Injectable } from '@nestjs/common';
import { IFileProcessingService } from '../../file-and-json-processing/services/file-processing.service.interface';
//import { IJsonProcessingService } from '../../file-and-json-processing/services/json-processing.service.interface';
import { IDataProcessingService } from './data-processing.service.interface';

@Injectable()
export class DataProcessingService implements IDataProcessingService {
  constructor(
    @Inject('IFileProcessingService') private readonly fileProcessingService: IFileProcessingService,
  ) // @Inject('IJsonProcessingService') private readonly jsonProcessingService: IJsonProcessingService,
  {}

  processData(): any {
    return this.fileProcessingService.processFile();
  }
}
