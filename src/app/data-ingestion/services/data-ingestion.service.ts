import { Injectable } from '@nestjs/common';
import { IDataIngestionService } from './data-ingestion.service.interface';

@Injectable()
export class DataIngestionService implements IDataIngestionService {
  constructor() {}
}
