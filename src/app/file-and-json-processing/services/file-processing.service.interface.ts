import { Group } from '../models/group';

export interface IFileProcessingService {
  processXLSXFile(file: any): Group[];
}
