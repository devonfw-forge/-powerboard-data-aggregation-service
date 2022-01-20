import { Inject, Injectable } from '@nestjs/common';
import { IFileProcessingService } from '../../file-and-json-processing/services/file-processing.service.interface';
import { IJsonProcessingService } from '../../file-and-json-processing/services/json-processing.service.interface';
import { IDataProcessingService } from './data-processing.service.interface';
import xlsx from 'node-xlsx';
import { IDataIngestionService } from '../../data-ingestion/services/data-ingestion.service.interface';

@Injectable()
export class DataProcessingService implements IDataProcessingService {
  constructor(
    @Inject('IFileProcessingService') private readonly fileProcessingService: IFileProcessingService,
    @Inject('IJsonProcessingService') private readonly jsonProcessingService: IJsonProcessingService,
    @Inject('IDataIngestionService') private readonly dataIngestionService: IDataIngestionService,
  ) { }

  processData(obj: any, teamId: string): any {
    const x = this.fileProcessingService.processFile();
    console.log(x);
    const processedJson = this.jsonProcessingService.processJson(obj);

    return this.dataIngestionService.ingest(processedJson, teamId);
  }

  async uploadFileXlsxType(inputfile: any, teamId: string): Promise<any> {
    // Reading our test file
    console.log(inputfile);
    console.log(teamId);
    const file = xlsx.parse(inputfile.buffer);
    console.log('file read');
    return this.mapFileIntoObject(file);
  }

  mapFileIntoObject(file: any): Promise<any> {
    let result: any = [];
    const l1: any = file[0].data;
    for (let i = 1; i < l1.length; i++) {
      console.log(i);
      let temp: any = [];
      console.log(l1[0].length);
      for (let j = 0; j < l1[0].length; j++) {
        console.log(j);
        console.log(l1[0][j]);
        console.log(l1[i][j]);
        var obj = {
          key: l1[0][j],
          value: l1[i][j],
        };
        console.log(obj);
        temp.push(obj);
      }
      console.log('after loop');
      result.push(temp);
    }
    return result;
  }
}
