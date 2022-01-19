import { Inject, Injectable } from '@nestjs/common';
import { IJsonProcessingService } from '../../file-and-json-processing/services/json-processing.service.interface';
import { Sprint } from '../model/entities/sprint.entity';
import { IDataIngestionService } from './data-ingestion.service.interface';

@Injectable()
export class DataIngestionService implements IDataIngestionService {
  constructor(
    @Inject('IJsonProcessingService') private readonly jsonProcessingService: IJsonProcessingService
  ) { }

  // ingest(obj: any) {
  //   const processedData = this.jsonProcessingService.processJson(obj);
  //   console.log(processedData);
  //   let keys = Object.keys(processedData.properties[0]);
  //   console.log(keys);
  //   // let keys = processedData.properties[0].keys;
  //   // console.log(keys)
  //   // let temp = property.key;
  //   // console.log(temp);


  //   for (let i = 0; i < processedData.properties.length; i++) {
  //     let keys = Object(processedData.properties[0].keys);
  //     for (let j = 0; j < keys.length; j++) {
  // let x = keys[j].split("_");
  // var actualKey = x[x.length - 1];
  //       console.log("actualllllllllllllllllll")
  //       console.log(actualKey);
  //     }
  //     // console.log(actualKey);
  //   }
  // console.log("AAAAAAAAAAAAAAAAAAAAAA");
  // console.log(processedData);
  // for (let group of processedData) {

  // console.log("KKKKKKKKKKKKKKKKKKKKK")
  // console.log(entityKeys);

  // for (let property of processedData.properties) {
  //   let sprint = new Sprint();

  //   Object.keys(property);
  //   // console.log(processedDataKeys);
  //   var entityKeys = Object.keys(sprint);

  // if (entityKeys.includes(property.key)) {

  //     // let temp: string=obj.key
  //     let x = property.key;

  // (sprint as any)[x] = property.value;

  // let index = entityKeys.indexOf(property.key)
  // entityKeys.splice(index, 1);
  //     // data.temp = obj.value;

  //   }
  //   console.log(sprint);
  // }

  //}
  // }

  ingest(obj: any): any {
    const processedData = this.jsonProcessingService.processJson(obj);

    // for (let group of processedData) {
    let sprint = new Sprint();
    var entityKeys = Object.keys(sprint);
    // console.log(entityKeys);
    //let keysArray = [];
    // console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKkk")
    // console.log(Object.keys(processedData.properties[0]));


    for (let obj of processedData.properties) {
      //let key = processedData.properties[0].key;
      // console.log(obj);
      // console.log(obj.key)
      let x = obj.key;
      let splittedKeys = x.split("_");
      // console.log("Splittedddddddddddddddd");
      // console.log(splittedKeys);
      var actualKey = splittedKeys[splittedKeys.length - 1];

      console.log(actualKey);
      if (splittedKeys[1] == 0) {
        let y = splittedKeys[splittedKeys.length - 1]
        console.log(y)
      }
      if (entityKeys.includes(actualKey)) {
        (sprint as any)[x] = obj.value;

        let index = entityKeys.indexOf(actualKey)
        entityKeys.splice(index, 1);
        console.log(sprint);
      }

      //keysArray.push(actualKey);
      //console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIi")
      //console.log(processedData.properties[obj]);
      // if (entityKeys.includes(obj.key)) {

      //   // let temp: string=obj.key
      //   let x = obj.key;

      //   (sprint as any)[x] = obj.value;

      //   let index = entityKeys.indexOf(obj.key)
      //   entityKeys.splice(index, 1);
      //   // data.temp = obj.value;
      //   console.log(sprint);
      // }
      // console.log(sprint);
    }
    //console.log(keysArray)
    //}
  }
}

