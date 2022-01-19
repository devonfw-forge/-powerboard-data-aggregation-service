import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { IDataIngestionService } from '../services/data-ingestion.service.interface';
// import { Response as eResponse } from 'express';



@Controller('data-ingestion')
export class DataIngestionController {
  constructor(@Inject('IDataIngestionService') private readonly dataIngestionService: IDataIngestionService) { }

  @Get('test')
  getHello(): string {
    console.log('HIIIIIIIIIIIIIII');
    return 'hello';
  }

  @Post('ingest')
  ingestData(@Body() obj: any): any {
    return this.dataIngestionService.ingest(obj)
    // res.status(200).json(result);
  }

}
