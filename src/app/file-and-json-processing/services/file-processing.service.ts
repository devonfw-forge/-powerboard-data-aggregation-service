import { Injectable } from '@nestjs/common';
import { IFileProcessingService } from './file-processing.service.interface';
import xlsx from 'node-xlsx';
import { Group } from '../models/group';
import { Property } from '../models/property';

@Injectable()
export class FileProcessingService implements IFileProcessingService {
  constructor() {}

  processXLSXFile(file: any): Group[] {
    const xlsxFile = xlsx.parse(file.buffer);
    return this.mapFileIntoObject(xlsxFile);
  }

  mapFileIntoObject(file: any): Group[] {
    let result: Group[] = [];
    const l1: any = file[0].data;
    for (let i = 1; i < l1.length; i++) {
      let group: Group = {} as Group;
      group.properties = [];
      console.log(l1[0].length);
      for (let j = 0; j < l1[0].length; j++) {
        var obj: Property = {
          key: l1[0][j],
          value: l1[i][j],
        };
        group.properties.push(obj);
      }
      result.push(group);
    }
    return result;
  }
}
