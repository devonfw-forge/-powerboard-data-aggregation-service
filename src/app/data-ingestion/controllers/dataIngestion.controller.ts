import { Controller, Get, } from '@nestjs/common';

// import { Response as eResponse } from 'express';



@Controller('data-ingestion')
export class DataIngestionController {
  constructor()
  //  @Inject('IDataIngestionService') private readonly dataIngestionService: IDataIngestionService) 
  { }

  @Get('test')
  getHello(): string {
    console.log('HIIIIIIIIIIIIIII');
    return 'hello';
  }

  // @Post('ingest')
  // ingestData(@Body() obj: any): any {
  //   return this.dataIngestionService.ingest(obj)
  //   // res.status(200).json(result);
  // }

}
