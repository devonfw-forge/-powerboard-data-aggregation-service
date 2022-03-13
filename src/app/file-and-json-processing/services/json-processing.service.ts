import { Injectable } from '@nestjs/common';
import { Group } from '../models/group';
import { Property } from '../models/property';
import { IJsonProcessingService } from './json-processing.service.interface';

@Injectable()
export class JsonProcessingService implements IJsonProcessingService {
  /**
   * 
   * Extract nested values and set in key value pair
   */
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

  /**
   * 
   * Set values of the object into array of key & value pair
   */
  processJson(obj: any): any {
    const JSON_Obj = this.flattenJSON(obj, {});
    let group = {} as Group;
    let result: Group[] = [];
    group.properties = [];
    for (var k in JSON_Obj) {
      let properties: Property = {
        key: k,
        value: JSON_Obj[k],
      };
      group.properties.push(properties);
    }
    result.push(group);
    return result;
  }
}
