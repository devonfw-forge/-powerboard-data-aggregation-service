import { Group } from '../../file-and-json-processing/models/group';

export interface IDataProcessingService {
  uploadFileXlsxType(file: any): Promise<any>;
  mapFileIntoObject(file: any): Group[];
  processData(obj: any): any;
}
