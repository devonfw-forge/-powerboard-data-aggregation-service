import { Group } from '../../file-and-json-processing/models/group';

export interface IDataIngestionService {

    ingest(obj: any, teamId: string): any
    ingestCodeQuality(processedJson: Group[], teamId: string): any
}
