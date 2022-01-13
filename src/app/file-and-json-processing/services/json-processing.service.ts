import { Injectable } from '@nestjs/common';
import { IJsonProcessingService } from './json-processing.service.interface';

@Injectable()
export class JsonProcessingService implements IJsonProcessingService {
  constructor() {}

  processJson(obj: any): any {
    return this.flattenJSON(obj, {});
  }

  flattenJSON(obj: any, res: any, extraKey = ''): any {
    for (let key in obj) {
      if (typeof obj[key] !== 'object') {
        res[extraKey + key] = obj[key];
      } else {
        this.flattenJSON(obj[key], res, `${extraKey}${key}_`);
      }
    }
    return res;
  }
}
