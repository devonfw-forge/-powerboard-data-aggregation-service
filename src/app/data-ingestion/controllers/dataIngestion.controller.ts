import { Controller, Get } from '@nestjs/common';

@Controller('data-ingestion')
export class DataIngestionController {
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
