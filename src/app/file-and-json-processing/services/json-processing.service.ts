import { Injectable } from '@nestjs/common';
import { Group } from '../models/group';
import { Property } from '../models/property';
import { IJsonProcessingService } from './json-processing.service.interface';

@Injectable()
export class JsonProcessingService implements IJsonProcessingService {
  /**
   * It will flat down any multi nested json object into a single straight json object
   */
  flattenJSON(obj: any, res: any, extraKey = ''): any {
    for (let key in obj) {
      if (typeof obj[key] !== 'object') {
        res[extraKey + key] = obj[key];
      } else {
        this.flattenJSON(obj[key], res, `${extraKey}${key}_`);
      }
    }
    console.log("flatted object");
    console.log(res);
    return res;
  }

  /**
   * It first flattens the Json object and then convert each field and its value in the json 
   * into a key-value pair and returns the whole object 
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
    console.log('Processedd Jssoooonnnnnnnn');
    console.log(result);
    return result;
  }
}
