import { Controller, Inject, Post, UploadedFile, UseInterceptors, Response, Body, Param } from '@nestjs/common';
import { IDataProcessingService } from '../services/data-processing.service.interface';
import { Response as eResponse } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

//import { Cron, CronExpression } from '@nestjs/schedule';
@Controller('data-processing')
export class DataProcessingController {
  constructor(@Inject('IDataProcessingService') private dataProcessingService: IDataProcessingService) { }

  @Post('processJson/:type/:teamId')
  async processData(
    @Body() obj: any,
    @Param('type') type: string,
    @Param('teamId') teamId: string,
    @Response() res: eResponse,
  ): Promise<any> {

    const result = await this.dataProcessingService.processJSON(obj, teamId, type);
    res.status(200).json(result);
  }
  @Post('processFile/:type/:teamId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileXlsxp(
    @UploadedFile() file: any,
    @Param('teamId') teamId: string,
    @Param('type') type: string,
    @Response() res: eResponse,
  ): Promise<void> {
    console.log(file);
    const result = await this.dataProcessingService.processXLSXfile(file, teamId, type);
    res.status(201).json(result);
  }


}
