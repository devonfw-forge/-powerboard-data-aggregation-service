import { Group } from '../../file-and-json-processing/models/group';

export interface IDataIngestionService {
  ingestJira(obj: any, teamId: string): any;
  ingestCodeQuality(processedJson: Group[], teamId: string): any;
  ingestTeamSpirit(processedJson: Group[], teamId: string): any;
  ingestClientStatus(processedJson: Group[], teamId: string): any
}
