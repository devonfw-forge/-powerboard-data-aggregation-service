export interface IDataProcessingService {
  processData(): any;
  uploadFileXlsxType(file: any): Promise<any>;
  mapFileIntoObject(file: any): Promise<any>;
}
