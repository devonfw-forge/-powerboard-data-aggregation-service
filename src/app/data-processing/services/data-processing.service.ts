import { HttpService, Inject, Injectable } from '@nestjs/common';
import { IFileProcessingService } from '../../file-and-json-processing/services/file-processing.service.interface';
import { IJsonProcessingService } from '../../file-and-json-processing/services/json-processing.service.interface';
import { IDataProcessingService } from './data-processing.service.interface';
import { IDataIngestionService } from '../../data-ingestion/services/data-ingestion.service.interface';
import { IValidationService } from '../../file-and-json-processing/services/validations.service.interface';



@Injectable()
export class DataProcessingService implements IDataProcessingService {
  constructor(
    @Inject('IFileProcessingService') private readonly fileProcessingService: IFileProcessingService,
    @Inject('IJsonProcessingService') private readonly jsonProcessingService: IJsonProcessingService,
    @Inject('IDataIngestionService') private readonly dataIngestionService: IDataIngestionService,
    @Inject('IValidationService') private readonly validationService: IValidationService,
    private httpService: HttpService
  ) { }

  /**
   * It gets back the processed Json object from the json processing service and then call the 
   * corresponding ingest method for the specific data type with the help of ingestEntities method
   */
  async processJSON(obj: any, teamId: string, type: string): Promise<any> {
    const processedJson = this.jsonProcessingService.processJson(obj);
    return this.ingestEntities(processedJson, type, teamId);
  }

  /**
   * It gets back the processed file data from file processing service and then calls the corresponding
   * ingest method for the specific data type with the help of ingestEntities method
   */
  async processXLSXfile(file: any, teamId: string, type: string): Promise<any> {
    const processedJson = this.fileProcessingService.processXLSXFile(file);
    return this.ingestEntities(processedJson, type, teamId);
  }

  /**
   * It calls different ingest methods of ingest service based on the component type of processed data
   * and returns the corresponding ingested entity object
   */
  async ingestEntities(processedData: any, type: string, teamId: string) {
    const componentType: string = type.toLowerCase();

    if (componentType == 'jira') {
      return this.dataIngestionService.ingestJira(processedData, teamId);
    }
    if (componentType == 'sonar') {
      let result = this.validationService.validateSonar(processedData);
      console.log(result);
      if (result) {
        return this.dataIngestionService.ingestCodeQuality(processedData, teamId);
      }
    }
    if (componentType == 'teamspirit') {
      return this.dataIngestionService.ingestTeamSpirit(processedData, teamId);
    }
    if (componentType == 'clientstatus') {
      return this.dataIngestionService.ingestClientStatus(processedData, teamId);
    }
  }

  async getTeamSpiritRating(teamName: string): Promise<any> {
    const url = process.env.teamSpiritURL;
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHH")
    console.log(url)
    const bearerToken = process.env.bearerToken;

    const headersRequest = {
      'Content-Type': 'application/json', // afaik this one is not needed
      'Authorization': `Bearer ${bearerToken}`,
    };

    const response = await this.httpService.get(url + '/survey/result/' + teamName, { headers: headersRequest }).toPromise()
      .then((res: any) => {
        return res.data;
      });
    console.log("This is response");
    console.log(response)
    return response;
    // .pipe(
    //   map(response => response.data),
    // );
  }
}