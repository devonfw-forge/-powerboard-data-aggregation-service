export interface IDataProcessingService {
  uploadFileXlsxType(file: any): Promise<any>;
  mapFileIntoObject(file: any): Promise<any>;
  processData(obj: any): any;
}
