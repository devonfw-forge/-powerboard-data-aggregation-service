import { Inject, Injectable } from '@nestjs/common';
import { IFileProcessingService } from '../../file-and-json-processing/services/file-processing.service.interface';
import { IJsonProcessingService } from '../../file-and-json-processing/services/json-processing.service.interface';
import { IDataProcessingService } from './data-processing.service.interface';
import { IDataIngestionService } from '../../data-ingestion/services/data-ingestion.service.interface';

@Injectable()
export class DataProcessingService implements IDataProcessingService {
  constructor(
    @Inject('IFileProcessingService') private readonly fileProcessingService: IFileProcessingService,
    @Inject('IJsonProcessingService') private readonly jsonProcessingService: IJsonProcessingService,
    @Inject('IDataIngestionService') private readonly dataIngestionService: IDataIngestionService,
  ) {}

  processData(obj: any, teamId: string): any {
    const processedJson = this.jsonProcessingService.processJson(obj);
    return this.dataIngestionService.ingest(processedJson, teamId);
  }

  async processXLSXfile(file: any, teamId: string): Promise<any> {
    const processedJson = await this.fileProcessingService.processXLSXFile(file);
    return await this.dataIngestionService.ingest(processedJson, teamId);
  }
}
