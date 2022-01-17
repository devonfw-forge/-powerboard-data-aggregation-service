import { Inject, Injectable } from '@nestjs/common';
import { IFileProcessingService } from '../../file-and-json-processing/services/file-processing.service.interface';
import { IJsonProcessingService } from '../../file-and-json-processing/services/json-processing.service.interface';
import { IDataProcessingService } from './data-processing.service.interface';
import xlsx from 'node-xlsx';
import { Property } from '../../file-and-json-processing/models/property';
import { Group } from '../../file-and-json-processing/models/group';

@Injectable()
export class DataProcessingService implements IDataProcessingService {
  constructor(
    @Inject('IFileProcessingService') private readonly fileProcessingService: IFileProcessingService,
    @Inject('IJsonProcessingService') private readonly jsonProcessingService: IJsonProcessingService,
  ) {}

  processData(obj: any): any {
    const x = this.fileProcessingService.processFile();
    console.log(x);
    return this.jsonProcessingService.processJson(obj);
  }

  async uploadFileXlsxType(inputfile: any): Promise<any> {
    // Reading our test file
    console.log(inputfile);
    const file = xlsx.parse(inputfile.buffer);
    console.log('file read');
    return this.mapFileIntoObject(file);
  }

  mapFileIntoObject(file: any): Group[] {
    let result: Group[] = [];
    const l1: any = file[0].data;
    for (let i = 1; i < l1.length; i++) {
      let group: Group = {} as Group;
      group.properties = [];
      for (let j = 0; j < l1[0].length; j++) {
        var obj: Property = {
          key: l1[0][j],
          value: l1[i][j],
        };
        group.properties.push(obj);
      }
      result.push(group);
    }
    console.log(typeof result);
    return result;
  }
}
