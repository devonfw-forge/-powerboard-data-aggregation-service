import { Controller, Inject, Post, UploadedFile, UseInterceptors, Response, Body, Param } from '@nestjs/common';
import { IDataProcessingService } from '../services/data-processing.service.interface';
import { Response as eResponse } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('data-processing')
export class DataProcessingController {
  constructor(@Inject('IDataProcessingService') private dataProcessingService: IDataProcessingService) { }

  @Post('processJson/:teamId')
  async processData(@Body() obj: any, @Param('teamId') teamId: string, @Response() res: eResponse): Promise<any> {
    const result = await this.dataProcessingService.processData(obj, teamId);
    res.status(200).json(result);
  }
  @Post('processFile/:teamId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileXlsxp(@UploadedFile() file: any, @Param('teamId') teamId: string, @Response() res: eResponse): Promise<void> {
    console.log(file);
    const result = await this.dataProcessingService.uploadFileXlsxType(file, teamId);
    res.status(201).json(result);
  }
}
