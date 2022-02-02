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
  ) { }

  async processJSON(obj: any, teamId: string, type: string): Promise<any> {
    const processedJson = this.jsonProcessingService.processJson(obj);
    return this.ingestEntities(processedJson, type, teamId);
  }

  async processXLSXfile(file: any, teamId: string, type: string): Promise<any> {
    const processedJson = this.fileProcessingService.processXLSXFile(file);
    return this.ingestEntities(processedJson, type, teamId);
  }

  async ingestEntities(processedData: any, type: string, teamId: string) {
    const componentType: string = type.toLowerCase();

    if (componentType == 'jira') {
      return this.dataIngestionService.ingestJira(processedData, teamId);
    }
    if (componentType == 'sonar') {
      return this.dataIngestionService.ingestCodeQuality(processedData, teamId);
    }
  }
}
