export interface IDataProcessingService {
  processJSON(obj: any, teamId: string, componentType: string): any;
  processXLSXfile(file: any, teamId: string, componentType: string): any;

}
