export interface IDataProcessingService {
  processData(obj: any, teamId: string): any;
  processXLSXfile(file: any, teamId: string): any;
}
