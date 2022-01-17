import { Controller, Get } from '@nestjs/common';

@Controller('data-processing')
export class DataIngestionController {
  constructor() {}

  @Get('test')
  getHello(): string {
    console.log('HIIIIIIIIIIIIIII');
    return 'hello';
  }
}
