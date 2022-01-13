import { Body, Controller, Response, Inject, Post } from '@nestjs/common';
import { IDataProcessingService } from '../services/data-processing.service.interface';
import { Response as eResponse } from 'express';
@Controller('data-processing')
export class DataProcessingController {
  constructor(@Inject('IDataProcessingService') private dataProcessingService: IDataProcessingService) {}

  @Post('test')
  processData(@Body() obj: any, @Response() res: eResponse): any {
    const result = this.dataProcessingService.processData(obj);
    res.status(200).json(result);
  }
}
