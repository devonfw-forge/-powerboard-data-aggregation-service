import { Controller, Get, Inject } from '@nestjs/common';
import { IDataProcessingService } from '../services/data-processing.service.interface';

@Controller('data-processing')
export class DataProcessingController {
  constructor(@Inject('IDataProcessingService') private dataProcessingService: IDataProcessingService) {}

  @Get('test')
  getHello(): string {
    console.log('HIIIIIIIIIIIIIII');
    return this.dataProcessingService.processData();
  }
}
