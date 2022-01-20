export interface IDataProcessingService {
  uploadFileXlsxType(file: any, teamId: string): Promise<any>;
  mapFileIntoObject(file: any): Promise<any>;
  processData(obj: any, teamId: string): any;
}
